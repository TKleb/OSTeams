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

		const userRow = await pgConnector.executeStoredProcedure("get_user_by_email", [email]);
		if (userRow.length === 0) {
			return res.render("login", { error: "Invalid credentials" });
		}

		const user = userRow[0];
		if (await bcrypt.compare(password, user.password_hash)) {
			req.session.loggedIn = true;
			req.session.email = email;
			req.session.userId = user.id;
			req.flash("success", "Logged in successfully.");
			return res.redirect("/");
		}
		return res.render("login", { error: "Invalid credentials" });
	}
}

export default new LoginController();
