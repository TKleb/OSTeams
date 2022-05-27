import bcrypt from "bcryptjs";
import pgConnector from "../services/pg-connector.js";

class LoginController {
	index(req, res) {
		res.render("login", {
			title: "login", hint: req.flash("hint"), error: req.flash("error"), success: req.flash("success"),
		});
	}

	async login(req, res) {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.render("login", { error: "Please provide email and password" });
		}

		const user = await pgConnector.getUserByEmail(email);
		if (!user) {
			return res.render("login", { error: "Invalid credentials" });
		}

		if (await bcrypt.compare(password, user.password_hash)) {
			req.session.loggedIn = true;
			req.session.email = email;
			req.session.userId = user.id;
			req.flash("success", "Logged in successfully.");
			const referer = req.get("referer");
			const redirectURL = referer.includes("/login") ? "/" : referer;
			return res.redirect(redirectURL);
		}
		return res.render("login", { error: "Invalid credentials" });
	}
}

export default new LoginController();
