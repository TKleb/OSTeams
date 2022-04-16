export class AccountController {
	index(req, res) {
		res.render("account", { title: "Account" });
	}

	logout(req, res) {
		req.session.destroy();
		res.redirect("/");
	}
}

export const accountController = new AccountController();
