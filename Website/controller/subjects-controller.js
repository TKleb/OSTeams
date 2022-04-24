import pgConnector from "../services/pg-connector.js";

class SubjectsController {
	index(req, res) {
		res.render("subjects");
	}

	subjects(req, res) {
		pgConnector.executeStoredProcedure("get_subjects")
			.then((pSubjects) => {
				res.render("subjects", { subjects: pSubjects });
			}).catch((err) => {
				res.render("subjects", { subjects: [], error: err });
			});
	}

	insert(req, res) {
		if (!req.body.abbr || !req.body.subName) {
			return res.render("subjects", { error: "Please provide an Abbreviation and a Subject name." });
		}

		return pgConnector.executeStoredProcedure("add_subject", [req.body.abbr, req.body.subName])
			.then(() => {
				res.redirect("/subjects");
			}).catch((err) => {
				res.render("subjects", { subjects: [], error: err });
			});
	}
}

export default new SubjectsController();
