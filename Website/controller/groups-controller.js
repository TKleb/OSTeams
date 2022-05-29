import mailer from "../services/mailer.js";
import pgConnector from "../services/pg-connector.js";
import websiteConfig from "../config/website.config.js";
import { timestampToDisplayString } from "../utils/date-convert.js";
import {
	isNumeric,
	areNumeric,
	isApplyByDateValid,
	isMaxMemberCountValid,
	isGroupDescriptionValid,
	isGroupNameValid,
	inputValidationSettings,
} from "../utils/input-validation-util.js";

async function sendApplicationEmailToOwner(req, id, res) {
	const htmlBody = `<p>You got a new application from ${req.session.email} for one of your groups.</p>`
		+ "<p> Click on the following link to view all applicants: "
		+ `<a href="${websiteConfig.hostname}:${websiteConfig.port}/groups/${id}">link</a></p>`;

	const groupOwner = await pgConnector.getOwnerByGroupId(id);
	const response = await mailer.SendMail(groupOwner.email, "New Application - OSTeams", htmlBody);
	req.flash("hint", response);
	return res.redirect("/");
}

async function userLeaveGroup(req, groupId, res) {
	await pgConnector.removeUserFromGroup(req.session.userId, groupId);
	req.flash("success", "Successfully left group");
	return res.redirect("/groups");
}

async function kickUserFromGroup(req, userId, groupId, res) {
	await pgConnector.removeUserFromGroup(userId, groupId);
	req.flash("success", "Member kicked out successfully");
	return res.redirect("/groups/".concat(groupId));
}

async function asyncFilter(arr, predicate) {
	const results = await Promise.all(arr.map(predicate));
	return arr.filter((_v, index) => results[index]);
}

function getGroupsUserCanApplyTo(subjectId, userId) {
	return pgConnector.getGroupsBySubjectId(subjectId)
		.then(async (groups) => asyncFilter(groups, async (group) => pgConnector.isApplicationPossible(
			userId,
			group.id,
		)));
}

async function attachOwnerAndMemberCount(groups) {
	await Promise.all(
		groups.map((group) => Promise.all([
			pgConnector.getMembersByGroupId(group.id)
				.then((members) => {
					group.current_member_count = members.length;
				}),
			pgConnector.getUserById(group.owner_id)
				.then((owner) => {
					group.owner = owner.email;
				})
		]))
	);
}

function attachDeadlineDisplay(group) {
	group.deadlineDisplay = timestampToDisplayString(group.apply_by_date);
	return group;
}

async function getApplicationsToGroupForDisplay(id) {
	const applications = await pgConnector.getApplicationsToGroup(id);
	const promises = applications.map((app) => pgConnector.getUserById(app.user_id));
	return Promise.all(promises)
		.then((arr) => arr.map((applicant, i) => {
			const application = applications[i];
			application.user_email = applicant.email;
			return application;
		}));
}

class GroupsController {
	async showGroupsOfUser(req, res) {
		let groups = await pgConnector.getGroupsOfUserById(req.session.userId);
		await attachOwnerAndMemberCount(groups);
		groups = groups.map(attachDeadlineDisplay);
		res.render("grouplist", {
			title: "Your Groups",
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			showAllGroups: false,
			groups,
		});
	}

	async showGroupsOfSubject(req, res) {
		const { abbreviation } = req.params;
		const subject = await pgConnector.getSubjectbyAbbreviation(abbreviation);
		if (!subject) {
			return res.send("Invalid subject");
		}

		let groups = await getGroupsUserCanApplyTo(subject.id, req.session.userId);
		await attachOwnerAndMemberCount(groups);
		groups = groups.map(attachDeadlineDisplay);
		return res.render("grouplist", {
			title: "Groups of ".concat(abbreviation),
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			showAllGroups: true,
			groups,
			groupNameLength: inputValidationSettings.maxGroupNameLenght,
			groupDescriptionLength: inputValidationSettings.maxGroupDescriptionLength,
			minGroupMembers: inputValidationSettings.minMemberCount,
			maxGroupMembers: inputValidationSettings.maxMemberCount,
		});
	}

	async showGroupInDetail(req, res) {
		const { id: groupId } = req.params;

		if (!isNumeric(groupId)) {
			req.flash("error", "Invalid parameter");
			return res.redirect("/");
		}

		let group = await pgConnector.getGroupById(groupId);
		// eslint-disable-next-line prefer-destructuring
		if (!group) {
			req.flash("error", "Invalid GroupId");
			return res.redirect("/");
		}
		group = attachDeadlineDisplay(group);

		const isOwner = req.session.userId === group.owner_id;
		const [members, applicants] = await Promise.all([
			pgConnector.getMembersByGroupId(groupId),
			getApplicationsToGroupForDisplay(groupId),
		]);
		const isNotFull = members.length < group.max_member_count;
		const isVisitor = members.find((member) => member.id === req.session.userId) === undefined;

		return res.render("group", {
			title: group.name,
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			group,
			isNotFull,
			isOwner,
			isVisitor,
			applicants,
			members,
		});
	}

	async editGroupById(req, res) {
		const { id } = req.params;

		if (!isNumeric(id)) {
			req.flash("error", "Missing fields");
			return res.redirect("/");
		}

		const group = await pgConnector.getGroupById(id);
		if (!group) {
			req.flash("error", "Invalid GroupId");
			return res.redirect("/");
		}

		const isOwner = req.session.userId === group.owner_id;
		return res.render("editGroup", {
			title: group.name,
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			group,
			isOwner,
			descriptionLength: inputValidationSettings.maxGroupDescriptionLength,
			groupNameLength: inputValidationSettings.maxGroupNameLenght,
			minMemberCount: inputValidationSettings.minMemberCount,
			maxMemberCount: inputValidationSettings.maxMemberCount,
		});
	}

	async updateGroup(req, res) {
		const { id } = req.params;
		const {
			name,
			description,
			maxMemberCount,
			applyByDate,
		} = req.body;

		if (!isGroupDescriptionValid(description)
			|| !isNumeric(id)
			|| !isMaxMemberCountValid(maxMemberCount)
			|| !isApplyByDateValid(applyByDate)
			|| !isGroupNameValid(name)
		) {
			req.flash("error", "Invalid input");
			return res.redirect("/");
		}

		const group = await pgConnector.getGroupById(id);
		if (group.owner_id !== req.session.userId) {
			req.flash("error", "Insufficient permissions");
			return res.redirect(req.get("referer"));
		}
		const options = [
			group.id,
			name,
			group.owner_id,
			group.subject_id,
			description,
			maxMemberCount,
			applyByDate,
			group.closed,
		];

		await pgConnector.editGroupById(options);
		req.flash("success", "Saved successfully");
		return res.redirect("/groups/".concat(id));
	}

	async closeApplication(req, res) {
		const { applicationId, groupId } = req.params;
		const { accept } = req.body;

		if (!areNumeric(applicationId, groupId) || accept === undefined) {
			return res.send("Invalid parameters");
		}

		const group = await pgConnector.getGroupById(groupId);
		if (!group) {
			return res.send("Invalid GroupId");
		}

		if (group.owner_id !== req.session.userId) {
			return res.send("Insufficient permissions");
		}

		const isAccepted = accept === "true";
		await pgConnector.closeApplication(applicationId, isAccepted);
		const successMsg = isAccepted ? "Application approved" : "Application denied";
		req.flash("success", successMsg);
		return res.redirect("/groups/".concat(groupId));
	}

	async leaveGroup(req, res) {
		const { id: groupId } = req.params;

		if (!isNumeric(groupId)) {
			req.flash("error", "Invalid parameter");
			return res.redirect("/");
		}

		const members = await pgConnector.getMembersByGroupId(groupId);
		const group = await pgConnector.getGroupById(groupId);
		if (!group) {
			return res.send("Invalid GroupId");
		}

		if ((members.find((member) => member.id === req.session.userId) === undefined)
			|| (group.owner_id === req.session.userId)) {
			return res.send("Cannot leave group");
		}

		return userLeaveGroup(req, groupId, res);
	}

	async kickOutMember(req, res) {
		const { groupId, userId } = req.params;

		if (!areNumeric(groupId, userId)) {
			req.flash("error", "Invalid parameter");
			return res.redirect("/");
		}

		const group = await pgConnector.getGroupById(groupId);
		if (group.owner_id !== req.session.userId) {
			req.flash("error", "Insufficient permissions");
			return res.send("/");
		}
		if (group.owner_id === userId) {
			req.flash("error", "Cannot kick out owner of the group");
			return res.redirect("/");
		}

		return kickUserFromGroup(req, userId, groupId, res);
	}

	async addGroup(req, res) {
		const { abbreviation } = req.params;
		const {
			groupName,
			description,
			maxMemberCount,
			applyByDate,
		} = req.body;

		if (!abbreviation || !description || !maxMemberCount || !applyByDate || !groupName) {
			req.flash("error", "Missing fields");
			return res.redirect(req.get("referer"));
		}

		if (!isApplyByDateValid(applyByDate) || !isMaxMemberCountValid(maxMemberCount)) {
			req.flash("error", "Invalid input");
			return res.redirect(req.get("referer"));
		}

		const subject = await pgConnector.getSubjectbyAbbreviation(abbreviation);
		if (!subject) {
			return res.send("No subject found with the provided abbreviation");
		}

		// name, owner_id, subject_id, description, max_member_count, creation_date, apply_by_date
		const options = [
			groupName,
			req.session.userId,
			subject.id,
			description,
			maxMemberCount,
			new Date().toISOString(),
			new Date(applyByDate).toISOString(),
		];
		const group = await pgConnector.addGroup(options);

		return res.redirect("/groups/".concat(group.id));
	}

	async deleteGroup(req, res) {
		const { id } = req.params;

		if (!id) {
			req.flash("error", "Missing fields");
			return res.redirect("/");
		}

		const group = await pgConnector.getGroupById(id);
		if (!group) {
			req.flash("error", "Couldn't find group");
			return res.redirect("/");
		}

		if (group.owner_id !== req.session.userId) {
			req.flash("error", "You're not allowed to perform this action");
			return res.redirect("/");
		}

		const isGroupRemoved = await pgConnector.removeGroup(id);
		if (!isGroupRemoved) {
			req.flash("error", "Couldn't delete group");
			return res.redirect("/");
		}

		req.flash("success", "Group deleted successfully");
		return res.redirect("/groups");
	}

	async applyToGroup(req, res) {
		const { id: groupId } = req.params;
		const { description } = req.body;
		const { userId } = req.session;

		if (!isNumeric(groupId) || !description) {
			req.flash("error", "Invalid paramers");
			return res.redirect("/");
		}

		const group = await pgConnector.getGroupById(groupId);
		if (!group) {
			req.flash("error", "Couldn't find group");
			return res.redirect("/");
		}

		const applicationPossible = await pgConnector.isApplicationPossible(userId, groupId);
		if (!applicationPossible) {
			req.flash("error", "Application to this group is not possible");
			return res.redirect("/");
		}

		// 	user_id, group_id, text, timestamp
		const options = [
			userId,
			groupId,
			description,
			new Date().toISOString(),
		];
		const application = await pgConnector.addApplication(options);
		if (!application) {
			req.flash("error", "An error occurred with your application");
			return res.redirect("/");
		}

		return sendApplicationEmailToOwner(req, groupId, res);
	}
}
export default new GroupsController();
