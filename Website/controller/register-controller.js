import bcrypt from "bcryptjs";
import randToken from "rand-token";
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
		// TODO: better error handling of executeStoredProcedure (maybe in wrapper class?)
		return this.checkEmailUsed(email)
			.then(async (isEmailUsed) => {
				if (isEmailUsed) {
					return res.render("register", { error: "The provided email is already in use." });
				}
				const encryptedPassword = await this.hashPassword(password);
				const verificationToken = this.generateToken();

				return this.addUnverifiedUserToDB(email, encryptedPassword, verificationToken)
					.catch(() => res.render("register", { error: "There was an error creating your account." }))
					.then(() => {
						this.sendVerificationEmail(verificationToken, email)
							.then((response) => res.render("register", { hint: response }));
					});
			})
			.catch(() => res.render("register", { error: "There was an error checking your email" }));
	}

	async checkEmailUsed(email) {
		const response = await pgConnector.executeStoredProcedure("is_email_in_use", [email]);
		return response[0].is_email_in_use;
	}

	async sendVerificationEmail(verificationToken, email) {
		const htmlBody = "<p>In order to use OSTeams, "
			+ `click on the following link <a href="${websiteConfig.hostname}:${websiteConfig.port}/account/verifyEmail?token=${verificationToken}">link</a> `
			+ "to verify your email address</p>";

		const response = await mailer.SendMail(email, "Email verification - OSTeams", htmlBody);
		return response;
	}

	async addUnverifiedUserToDB(email, encryptedPassword, verificationToken) {
		await pgConnector.executeStoredProcedure("add_unverified_user", [
			"",
			"",
			email.toLowerCase(),
			encryptedPassword,
			verificationToken,
		]);
	}

	generateToken() {
		const tokenLength = 50;
		const verificationToken = randToken.generate(tokenLength);
		return verificationToken;
	}

	async hashPassword(password) {
		const saltLength = 10;
		const encryptedPassword = await bcrypt.hash(password, saltLength);
		return encryptedPassword;
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
