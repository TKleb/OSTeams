import { pgConnector } from "../services/pg-connector.js";

export class SubjectsController {
	index(req, res) {
		res.render("subjects");
	}

	async module(req, res) {
		pgConnector.executeStoredProcedure("get_subjects")
			.then((pSubjects) => {
				res.render("subjects", { subjects: pSubjects });
			}).catch((err) => {
				res.render("subjects", { subjects: [], error: err });
			});
	}
}

export const subjectsController = new SubjectsController();
