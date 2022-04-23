class TeamsController {
	index(req, res) {
		res.render("teams", { title: "Your Teams" });
	}
}

export default new TeamsController();
