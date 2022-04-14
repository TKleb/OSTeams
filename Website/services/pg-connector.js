import pgPromise from "pg-promise";

export class PGConnector {
	constructor() {
		const cn = {
			host: "database",
			port: 5432,
			database: "osteams",
			user: "backend",
			password: "password",
			max: 30, // use up to 30 connections
		};
		const pgp = pgPromise({});
		this.db = pgp(cn);
	}

	executeStoredProcedure(name, args = []) {
		return this.db.func(name, args)
			.then((response) => response)
			.catch((err) => {
				throw new Error("Couldn't invoke Stored Procedure: ".concat(err));
			});
	}
}

export const pgConnector = new PGConnector();
