import bcrypt from "bcryptjs";
import randToken from "rand-token";
import mailer from "../services/mailer.js";
import pgConnector from "../services/pg-connector.js";
import websiteConfig from "../config/website.config.js";

class RegisterController {
	index(req, res) {
		res.render("register", {
			title: "register", hint: req.flash("hint"), error: req.flash("error"), success: req.flash("success"),
		});
	}

	async register(req, res) {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.render("register", { error: "Please provide email and password." });
		}
		const isEmailInUseRow = await pgConnector.executeStoredProcedure("is_email_in_use", [email]);

		if (isEmailInUseRow[0].is_email_in_use) {
			return res.render("register", { error: "The provided email is already in use." });
		}

		const saltLength = 10;
		const encryptedPassword = await bcrypt.hash(password, saltLength);
		const tokenLength = 50;
		const verificationToken = randToken.generate(tokenLength);

		await pgConnector.executeStoredProcedure("add_unverified_user", [
			"",
			"",
			email.toLowerCase(),
			encryptedPassword,
			verificationToken,
		]);

		const htmlBody =		"<p>In order to use OSTeams, "
		+ `click on the following link <a href="${websiteConfig.hostname}:${websiteConfig.port}/account/verifyEmail?token=${verificationToken}">link</a> `
		+ "to verify your email address</p>";

		const response = await mailer.SendMail(email, "Email verification - OSTeams", htmlBody);
		return res.render("login", { hint: response });
	}

	verifyMail(req, res) {
		const verificationToken = req.query.token;

		if (!verificationToken) {
			return res.send("Invalid token");
		}

		return pgConnector.executeStoredProcedure("do_verify_user", [verificationToken])
			.then(() => res.render("index", { hint: "Email verified successfully" }))
			.catch(() => res.send("Invalid token"));
	}
}

export default new RegisterController();
