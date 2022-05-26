import mailer from "../services/mailer.js";
import pgConnector from "../services/pg-connector.js";
import websiteConfig from "../config/website.config.js";

async function sendApplicationEmailToOwner(req, id, res) {
	const htmlBody = `<p>You got a new application from ${req.session.email} for one of your groups.</p>`
		+ "<p> Click on the following link to view all applicants: "
		+ `<a href="${websiteConfig.hostname}:${websiteConfig.port}/groups/${id}">link</a></p>`;

	const groupOwnerRow = await pgConnector.getOwnerByGroupId(id);
	const response = await mailer.SendMail(groupOwnerRow[0].email, "New Application - OSTeams", htmlBody);
	req.flash("hint", response);
	return res.redirect("/");
}

async function userLeaveGroup(req, id, res) {
	await pgConnector.removeUserFromGroup(req.session.userId, id);
	req.flash("success", "Successfully left group");
	return res.redirect("/groups");
}

const asyncFilter = async (arr, predicate) => {
	const results = await Promise.all(arr.map(predicate));
	return arr.filter((_v, index) => results[index]);
};

async function getIsApplicationPossiblePerGroup(groupRows, req) {
	const groupRow = await asyncFilter(groupRows, async (group) => {
		return await pgConnector.isApplicationPossible(
			req.session.userId,
			group.id,
		);
	});
	return groupRow;
}
async function MembersByGroupId(groupRows) {
	for (const group of groupRows) {
		const members = await pgConnector.getMembersByGroupId(group.id);
		group.current_member_count = members.length;
		const groupOwner = await pgConnector.getUserById(group.owner_id);
		group.owner = groupOwner.email;
	}
}

const getApplicationsToGroupForDisplay = async (id) => {
	let applicants = [];
	const applications = await pgConnector.executeStoredProcedure("get_applications_to_group", [id]);
	const promises = applications.map((app) => pgConnector.getUserById(app.user_id));
	if (promises.length > 0) {
		applicants = await Promise.all(promises)
			.then((arr) => arr.map((user, i) => {
				const application = applications[i];
				application.user_email = user.email;
				return application;
			}));
	}
	return applicants;
};

class GroupsController {
	async showByUserId(req, res) {
		const groupRows = await pgConnector.getGroupsOfUserById(req.session.userId);
		await MembersByGroupId(groupRows);
		res.render("grouplist", {
			title: "Groups",
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			showAllGroups: false,
			groups: groupRows,
		});
	}

	async showBySubjectAbbr(req, res) {
		const { abbreviation } = req.params;
		const subjectRow = await pgConnector.getSubjectbyAbbreviation(abbreviation);
		if (!subjectRow || subjectRow.length === 0) {
			return res.send("Invalid subject");
		}

		let groupRows = await pgConnector.getGroupsBySubjectId(subjectRow[0].id);
		await MembersByGroupId(groupRows);
		groupRows = await getIsApplicationPossiblePerGroup(groupRows, req);


		return res.render("grouplist", {
			title: "Groups",
			groups: groupRows,
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			showAllGroups: true,
			groups: groupRows,
		});
	}

	async showGroupById(req, res) {
		const { id } = req.params;
		const group = await pgConnector.getGroupById(id);
		if (!group || group.length === 0) {
			return res.send("Invalid GroupId");
		}

		const isOwner = req.session.userId === group[0].owner_id;
		const members = await pgConnector.getMembersByGroupId(id);
		const applicants = await getApplicationsToGroupForDisplay(id);
		const isVisitor = members.find((member) => member.id === req.session.userId) === undefined;

		return res.render("group", {
			title: group[0].name,
			group: group[0],
			isOwner,
			isVisitor,
			applicants,
			members,
		});
	}

	async closeApplication(req, res) {
		const { applicationId, groupId } = req.params;
		const { accept } = req.body;

		if (!applicationId || !groupId || accept === undefined) {
			return res.send("Invalid parameters");
		}

		const groupRow = await pgConnector.getGroupById(groupId);
		if (!groupRow || groupRow.length === 0) {
			return res.send("Invalid GroupId");
		}

		if (groupRow[0].owner_id !== req.session.userId) {
			return res.send("Insufficient permissions");
		}

		const isAccepted = accept === "true";
		await pgConnector.closeApplication(applicationId, isAccepted);
		const successMsg = isAccepted ? "Application approved" : "Application denied";
		req.flash("success", successMsg);
		return res.redirect("/groups/".concat(groupId));
	}

	async leaveGroup(req, res) {
		const { id } = req.params;
		const members = await pgConnector.getMembersByGroupId(id);
		const groupRow = await pgConnector.getGroupById(id);
		if (!groupRow || groupRow.length === 0) {
			return res.send("Invalid GroupId");
		}

		if ((members.find((member) => member.id === req.session.userId) === undefined)
			|| (groupRow[0].owner_id === req.session.userId)) {
			return res.send("Cannot leave group");
		}

		return userLeaveGroup(req, id, res);
	}

	async insert(req, res) {
		const { abbreviation } = req.params;
		const {
			groupName,
			description,
			maxMemberCount,
			applyByDate,
		} = req.body;

		if (!abbreviation || !description || !maxMemberCount || !applyByDate || !groupName) {
			req.flash("error", "Missing fields");
			return res.redirect("/");
		}

		const subjectRow = await pgConnector.getSubjectbyAbbreviation(abbreviation);
		if (!subjectRow || subjectRow.length === 0) {
			return res.send("No subject found with the provided abbreviation");
		}

		// name, owner_id, subject_id, description, max_member_count, creation_date, apply_by_date
		const options = [
			groupName,
			req.session.userId,
			subjectRow[0].id,
			description,
			maxMemberCount,
			new Date().toISOString(),
			new Date(applyByDate).toISOString(),
		];
		const groupRow = await pgConnector.addGroup(options);

		return res.redirect(websiteConfig.hostname.concat(":", websiteConfig.port, "/groups/", groupRow[0].id));
	}

	async applyToGroup(req, res) {
		const { id } = req.params;
		const { description } = req.body;

		if (!id || !description) {
			req.flash("error", "Missing fields");
			return res.redirect("/");
		}

		const groupRow = await pgConnector.getGroupById(id);
		if (!groupRow || groupRow.length === 0) {
			req.flash("error", "Couldn't find group");
			return res.redirect("/");
		}

		const groupMembers = await pgConnector.getMembersByGroupId(id);
		if (!groupMembers || groupMembers.length === groupRow[0].maxMemberCount) {
			req.flash("error", "Group member limit reached");
			return res.redirect("/");
		}

		// 	user_id, group_id, text, timestamp
		const options = [
			req.session.userId,
			id,
			description,
			new Date().toISOString(),
		];
		const applyResponseRow = await pgConnector.addApplication(options);
		if (!applyResponseRow || applyResponseRow.length === 0) {
			req.flash("error", "An error occurred with your application");
			return res.redirect("/");
		}

		return sendApplicationEmailToOwner(req, id, res);
	}
}
export default new GroupsController();
