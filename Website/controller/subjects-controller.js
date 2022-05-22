import pgConnector from "../services/pg-connector.js";

class SubjectsController {
	index(req, res) {
		res.render("subjects");
	}

	subjects(req, res) {
		pgConnector.executeStoredProcedure("get_subjects")
			.then((pSubjects) => {
				pSubjects.sort((a, b) => ((a.name > b.name) ? 1 : -1));
				res.render("subjects", { subjects: pSubjects });
			}).catch((err) => {
				res.render("subjects", { subjects: [], error: err });
			});
	}
}

export default new SubjectsController();
