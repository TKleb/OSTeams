import pgConnector from "../services/pg-connector.js";

class AccountController {
	index(req, res) {
		res.render("account", { title: "Account" });
	}

	async showUserInfo(req, res) {
		const currentUserData = await pgConnector.executeStoredProcedure("get_user_by_email", [req.session.email]);
		res.render("account", {
			title: "Account",
			edit: false,
			user: currentUserData[0]
		});
	}

	logout(req, res) {
		req.session.destroy();
		res.redirect("/");
	}

	async edit(req, res) {
		const currentUserData = await pgConnector.executeStoredProcedure("get_user_by_email", [req.session.email]);
		res.render("account", {
			title: "edit",
			edit: true,
			user: currentUserData[0]
		});
	}
}

export default new AccountController();
