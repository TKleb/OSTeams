export class TeamsController {
	index(req, res) {
		res.render("teams", { title: "Your Teams" });
	}
}

export const teamsController = new TeamsController();
