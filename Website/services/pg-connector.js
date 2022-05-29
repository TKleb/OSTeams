import pgPromise from "pg-promise";
import pgConfig from "../config/postgres.config.js";

function getFirst(reply) {
	if (!reply || reply.length < 1) {
		return undefined;
	}
	return reply[0];
}

class PGConnector {
	constructor() {
		const pgp = pgPromise({});
		pgp.pg.types.setTypeParser(20, BigInt); // Type Id 20 = BIGINT | BIGSERIAL
		this.db = pgp(pgConfig);
	}

	executeStoredProcedure(name, args = []) {
		return this.db.func(name, args)
			.then((response) => response)
			.catch((err) => {
				throw new Error("Couldn't invoke Stored Procedure: ".concat(err));
			});
	}

	addUnverifiedUser(email, hashedPassword, verificationToken) {
		return this.executeStoredProcedure("add_unverified_user", [
			"",
			"",
			email.toLowerCase(),
			hashedPassword,
			verificationToken,
		]);
	}

	getSubjects() {
		return this.executeStoredProcedure("get_subjects");
	}

	getUserById(id) {
		return this.executeStoredProcedure("get_user_by_id", [id])
			.then(getFirst);
	}

	getUserByEmail(email) {
		return this.executeStoredProcedure("get_user_by_email", [email])
			.then(getFirst);
	}

	editUserById(options) {
		return this.executeStoredProcedure("edit_user_by_id", options);
	}

	getGroupById(id) {
		return this.executeStoredProcedure("get_group_by_id", [id])
			.then(getFirst);
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
		return this.executeStoredProcedure("get_subject_by_abbreviation", [id])
			.then(getFirst);
	}

	getApplicationsToGroup(id) {
		return this.executeStoredProcedure("get_applications_to_group", [id]);
	}

	getOwnerByGroupId(id) {
		return this.executeStoredProcedure("get_owner_by_group_id", [id])
			.then(getFirst);
	}

	addApplication(options) {
		return this.executeStoredProcedure("add_application", options)
			.then(getFirst);
	}

	addGroup(options) {
		return this.executeStoredProcedure("add_group", options)
			.then(getFirst);
	}

	editGroupById(options) {
		return this.executeStoredProcedure("edit_group_by_id", options);
	}

	removeUserFromGroup(userId, groupId) {
		return this.executeStoredProcedure("do_remove_user_from_group", [userId, groupId]);
	}

	verifyUser(verificationToken) {
		return this.executeStoredProcedure("do_verify_user", [verificationToken])
			.then(getFirst);
	}

	closeApplication(applicationId, isAccepted) {
		return this.executeStoredProcedure("do_close_application", [applicationId, isAccepted]);
	}

	isApplicationPossible(userId, groupId) {
		return this.executeStoredProcedure("is_application_possible", [userId, groupId])
			.then(getFirst)
			.then((reply) => reply.is_application_possible);
	}

	isEmailInUse(email) {
		return this.executeStoredProcedure("is_email_in_use", [email])
			.then(getFirst)
			.then((reply) => reply.is_email_in_use);
	}

	removeGroup(groupId) {
		return this.executeStoredProcedure("do_remove_group_by_id", [groupId])
			.then(getFirst)
			.then((reply) => reply.do_remove_group_by_id);
	}

	removeUser(userId) {
		return this.executeStoredProcedure("do_remove_user_by_id", [userId])
			.then(getFirst)
			.then((reply) => reply.do_remove_user_by_id);
	}
}

export default new PGConnector();
