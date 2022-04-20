class AccountController {
	index(req, res) {
		res.render("account", { title: "Account" });
	}

	logout(req, res) {
		req.session.destroy();
		res.redirect("/");
	}
}

export default new AccountController();
