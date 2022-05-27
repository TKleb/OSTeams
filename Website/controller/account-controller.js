import pgConnector from "../services/pg-connector.js";

class AccountController {
	index(req, res) {
		res.render("account", { title: "Account" });
	}

	async showUserInfo(req, res) {
		const currentUserData = await pgConnector.executeStoredProcedure("get_user_by_email", [req.session.email]);
		res.render("account", { title: "Account", user: currentUserData[0] });
	}

	logout(req, res) {
		req.session.destroy();
		res.redirect("/");
	}

	edit(req, res) {
		res.render("editAccount", { title: "edit" });
	}
}

export default new AccountController();
