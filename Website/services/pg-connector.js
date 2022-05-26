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
		this.db = pgp(pgConfig);
	}

	executeStoredProcedure(name, args = []) {
		return this.db.func(name, args)
			.then((response) => response)
			.catch((err) => {
				throw new Error("Couldn't invoke Stored Procedure: ".concat(err));
			});
	}

	getUserById(id) {
		return this.executeStoredProcedure("get_user_by_id", [id])
			.then(getFirst);
	}
}

export default new PGConnector();
