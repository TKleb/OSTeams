import pgPromise from "pg-promise";
import pgConfig from "../config/postgres.config.js";

class PGConnector {
	constructor() {
		const pgp = pgPromise({});
		this.db = pgp(pgConfig);
	}

	executeStoredProcedure(name, args = []) {
		return this.db.func(name, args)
			.then((response) => response)
			.catch((err) => {
				throw new Error("Couldn't invoke Stored Procedure: ".concat(err));
			});
	}

	getGroupById(id) {
		return this.executeStoredProcedure("get_group_by_id", [id]);
	}

	getMembersByGroupId(id) {
		return this.executeStoredProcedure("get_members_by_group_id", [id]);
	}

	getGroupsOfUserById(id) {
		return this.executeStoredProcedure("get_groups_of_user_by_id", [id]);
	}

	getGroupsBySubjectId(id) {
		return this.executeStoredProcedure("get_groups_by_subject_id", [id]);
	}

	getSubjectbyAbbreviation(id) {
		return this.executeStoredProcedure("get_subject_by_abbreviation", [id]);
	}

	getApplicationsToGroup(id) {
		return this.executeStoredProcedure("get_applications_to_group", [id]);
	}

	getOwnerByGroupId(id) {
		return this.executeStoredProcedure("get_owner_by_group_id", [id]);
	}

	addApplication(options) {
		return this.executeStoredProcedure("add_application", options);
	}

	addGroup(options) {
		return this.executeStoredProcedure("add_group", options);
	}

	removeUserFromGroup(sessionId, id) {
		return this.executeStoredProcedure("do_remove_user_from_group", [sessionId, id]);
	}

	closeApplication(applicationId, isAccepted) {
		return this.executeStoredProcedure("do_close_application", [applicationId, isAccepted]);
	}

	isApplicationPossible(sessionId, groupId) {
		return this.executeStoredProcedure("is_application_possible", [req.session.userId, group.id]);
	}
}

export default new PGConnector();
