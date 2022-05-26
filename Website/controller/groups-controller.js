import mailer from "../services/mailer.js";
import pgConnector from "../services/pg-connector.js";
import websiteConfig from "../config/website.config.js";

const asyncFilter = async (arr, predicate) => {
	const results = await Promise.all(arr.map(predicate));
	return arr.filter((_v, index) => results[index]);
};

async function MembersByGroupId(groupRows) {
	for (const group of groupRows) {
		const members = await pgConnector.getMembersByGroupId(group.id);
		group.current_member_count = members.length;
	}
}

async function getIsApplicationPossiblePerGroup(groupRows, req) {
	const groupRow = await asyncFilter(groupRows, async (group) => {
		const isApplicationPossible = await
		pgConnector.isApplicationPossible(req.session.userId, group.id);
		return isApplicationPossible[0].is_application_possible;
	});
	return groupRow;
}

function renderGroups(res, req, groupRows) {
	res.render("groups", {
		title: "Groups",
		hint: req.flash("hint"),
		error: req.flash("error"),
		success: req.flash("success"),
		groups: groupRows,
	});
}

function renderGroupList(res, groupRows, req) {
	return res.render("grouplist", {
		title: "Groups",
		groups: groupRows,
		hint: req.flash("hint"),
		error: req.flash("error"),
		success: req.flash("success"),
	});
}

function renderGroup(res, groupRow, isOwner, applicants, members) {
	return res.render("group", {
		title: groupRow[0].name,
		group: groupRow[0],
		isOwner,
		applicants,
		members,
	});
}

async function userLeaveGroup(req, id, res) {
	await pgConnector.removeUserFromGroup(req.session.userId, id);
	req.flash("success", "Successfully left group");
	return res.redirect("/groups");
}

async function sendApplicationEmailToOwner(req, id, res) {
	const htmlBody = `<p>You got a new application from ${req.session.email} for one of your groups.</p>`
		+ "<p> Click on the following link to view all applicants: "
		+ `<a href="${websiteConfig.hostname}:${websiteConfig.port}/groups/${id}">link</a></p>`;

	const groupOwnerRow = await pgConnector.getOwnerByGroupId(id);
	const response = await mailer.SendMail(groupOwnerRow[0].email, "New Application - OSTeams", htmlBody);
	req.flash("hint", response);
	return res.redirect("/");
}

class GroupsController {
	async showByUserId(req, res) {
		const groupRows = await pgConnector.getGroupsOfUserById(req.session.userId);
		await MembersByGroupId(groupRows);
		renderGroups(res, req, groupRows);
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

		return renderGroupList(res, groupRows, req);
	}

	async showGroupById(req, res) {
		const { id } = req.params;
		const groupRow = await pgConnector.getGroupById(id);
		if (!groupRow || groupRow.length === 0) {
			return res.send("Invalid GroupId");
		}

		const isOwner = req.session.userId === groupRow[0].owner_id;
		const members = await pgConnector.getMembersByGroupId(id);
		const applicants = await pgConnector.getApplicationsToGroup(id);
		return renderGroup(res, groupRow, isOwner, applicants, members);
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
		await pgConnector.isApplicationPossible(applicationId, isAccepted);
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

		return await userLeaveGroup(req, id, res);
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

		return await sendApplicationEmailToOwner(req, id, res);
	}
}
export default new GroupsController();
