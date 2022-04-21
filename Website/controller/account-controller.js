export class AccountController {
	index(req, res) {
		res.render("account", { title: "Account" });
	}

	login(req, res) {
		res.render("login", { title: "Login" });
	}

	register(req, res) {
		res.render("register", { title: "register" });
	}

	forgotPw(req, res) {
		res.render("forgotPassword", { title: "forgot" });
	}

	editAccount(req, res) {
		res.render("editAccount", { title: "edit" });
	}
}

export const accountController = new AccountController();
