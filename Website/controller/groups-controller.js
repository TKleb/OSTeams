import mailer from "../services/mailer.js";
import pgConnector from "../services/pg-connector.js";
import websiteConfig from "../config/website.config.js";

class GroupsController {
	async showByUserId(req, res) {
		const groupRows = await pgConnector.executeStoredProcedure("get_groups_of_user_by_id", [req.session.userId]);
		res.render("groups", { title: "Groups", groups: groupRows });
	}

	async showBySubjectAbbr(req, res) {
		const { abbreviation } = req.params;

		const subjectRow = await pgConnector.executeStoredProcedure("get_subject_by_abbreviation", [abbreviation]);
		if (!subjectRow || subjectRow.length === 0) {
			return res.send("Invalid subject");
		}

		const groupRows = await pgConnector.executeStoredProcedure("get_groups_by_subject_id", [subjectRow[0].id]);
		return res.render("grouplist", { title: "Groups", groups: groupRows, hint: req.flash("hint"), error: req.flash("error"), success: req.flash("success")});
	}

	async showGroupById(req, res) {
		const { id } = req.params;
		const groupRow = await pgConnector.executeStoredProcedure("get_group_by_id", [id]);
		if (!groupRow || groupRow.length === 0) {
			return res.send("Invalid GroupId");
		}
		return res.render("group", { title: groupRow[0].name, group: groupRow[0] });
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
			res.redirect("/");
		}

		const subjectRow = await pgConnector.executeStoredProcedure("get_subject_by_abbreviation", [abbreviation]);
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
		const groupRow = await pgConnector.executeStoredProcedure("add_group", options);

		return res.redirect(websiteConfig.hostname.concat(":", websiteConfig.port, "/groups/", groupRow[0].id));
	}

	async applyToGroup(req, res) {
		const { id } = req.params;
		const { description } = req.body;

		if (!id || !description) {
			req.flash("error", "Missing fields");
			return res.redirect("/");
		}

		const groupRow = await pgConnector.executeStoredProcedure("get_group_by_id", [id]);
		if (!groupRow || groupRow.length === 0) {
			req.flash("error", "Couldn't find group");
			return res.redirect("/");
		}

		const groupMembers = await pgConnector.executeStoredProcedure("get_members_by_group_id", [id]);
		if (!groupMembers || groupMembers.length == groupRow[0].maxMemberCount) {
			req.flash("error", "Group member limit reached");
			return res.redirect("/");
		}

		// 	user_id, group_id, text, timestamp
		const options = [
			req.session.userId,
			id,
			description,
			new Date().toISOString(),
		]
		const applyResponseRow = await pgConnector.executeStoredProcedure("add_application", options);
		if(!applyResponseRow || applyResponseRow.length === 0) {
			req.flash("error", "An error occurred with your application");
			return res.redirect("/");
		}

		const htmlBody = `<p>You got a new application from ${req.session.email} for one of your groups.</p>`
		+ `<p> Click on the following list to view all applicants: `
		+ `<a href="${websiteConfig.hostname}:${websiteConfig.port}/groups/${id}">link</a></p>` ;

		// Stored procedure doesn't exist yet
		const groupOwnerRow = await pgConnector.executeStoredProcedure("get_owner_by_group_Id", [id]);
		const response = await mailer.SendMail(groupOwnerRow[0].email, "New Application - OSTeams", htmlBody);
		req.flash("hint", response);
		return res.redirect("/");
	}
}

export default new GroupsController();
