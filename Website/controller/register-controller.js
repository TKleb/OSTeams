import bcrypt from "bcryptjs";
import randToken from "rand-token"
import mailer from "../services/mailer.js";
import pgConnector from "../services/pg-connector.js";
import websiteConfig from "../config/website.config.js";

class RegisterController {
	index(req, res) {
		res.render("register", { title: "register" });
	}

	async register(req, res) {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.render("register", { error: "Please provide email and password." });
		}

		const isEmailInUseRow = await pgConnector.executeStoredProcedure("is_emailinuse", [email]);
		if (isEmailInUseRow[0].is_emailinuse) {
			return res.render("register", { error: "The provided email is already in use." });
		}

		const saltLength = 10;
		const encryptedPassword = await bcrypt.hash(password, saltLength);
		/* const user = await pgConnector.executeStoredProcedure("add_unverifieduser",
		 ["", "", email.toLowerCase(), encryptedPassword, "", new Date()]); */
		const user = await pgConnector.executeStoredProcedure("add_user", [
			"",
			"",
			email.toLowerCase(),
			encryptedPassword,
			"customInfoText",
			true,
			2020,
			"./default.jpg",
		]);

		if (user.length === 0) {
			return res.render("register", { error: "There was an error creating your account." });
		}

		const tokenLength = 50;
		const htmlBody =
		'<p>In order to use OSTeams, ' +
		'click on the following link <a href="' + websiteConfig.hostname + '/account/verifyEmail?token=' + randToken.generate(tokenLength) + '">link</a> ' +
		'to verify your email address</p>';

		const response = await mailer.SendMail(email, "Email verification - OSTeams", htmlBody);
		return res.render("register", { hint: response });
	}

	verifyMail(req, res) {
		const token = req.query.token;
		if(!token) {
			return res.send("Invalid token");
		}
		return res.render("index");
	}
}

export default new RegisterController();
