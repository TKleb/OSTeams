class AccountController {
	index(req, res) {
		res.render("account", { title: "Account" });
	}

	logout(req, res) {
		req.session.destroy();
		res.redirect("/");
	}

	editAccount(req, res) {
		res.render("editAccount", { title: "edit" });
	}
}

export default new AccountController();
