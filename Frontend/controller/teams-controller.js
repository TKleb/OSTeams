export class TeamsController {
    teams(req, res) {
        res.render("teams", {title: "Your Teams"});
    };
}

export const teamsController = new TeamsController();