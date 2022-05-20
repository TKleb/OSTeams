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
		return res.render("grouplist", { title: "Groups", groups: groupRows });
	}

	async showGroupById(req, res) {
		const { id } = req.params;
		const groupRow = await pgConnector.executeStoredProcedure("get_group_by_id", [id]);
		if (!groupRow || groupRow.length === 0) {
			return res.send("Invalid GroupId");
		}

		const isOwner = req.session.userId == groupRow[0].owner_id;
		const members = await pgConnector.executeStoredProcedure("get_members_by_group_id", [id]);
		const applicants = await pgConnector.executeStoredProcedure("get_applications_to_group", [id]);
		return res.render("group", {
			title: groupRow[0].name,
			group: groupRow[0],
			isOwner: isOwner,
			applicants: applicants,
			members: members,
		});
	}

	async closeApplication(req, res) {
		const { id } = req.params;
		const { isAccepted, groupId } = req.body;
		//Todo: Check if loggedInUser is owner of group this application belongs to

		const applicationResponse = await pgConnector.executeStoredProcedure("do_close_application", [id, isAccepted]);
		const successMsg = isAccepted ? "Application approved" : "Application denied";
		req.flash("success", successMsg);
		res.redirect(websiteConfig.hostname.concat(":", websiteConfig.port, "/groups/", groupId));
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
}

export default new GroupsController();
