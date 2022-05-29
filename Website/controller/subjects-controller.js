import pgConnector from "../services/pg-connector.js";

class SubjectsController {
	async index(req, res) {
		const subjects = await pgConnector.getSubjects();
		subjects.sort((a, b) => ((a.name > b.name) ? 1 : -1));
		res.render("subjects", {
			subjects,
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
		});
	}
}

export default new SubjectsController();
