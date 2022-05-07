import bcrypt from "bcryptjs";
import randToken from "rand-token";
import mailer from "../services/mailer.js";
import pgConnector from "../services/pg-connector.js";
import websiteConfig from "../config/website.config.js";

function checkEmailUsed(email) {
	return pgConnector.executeStoredProcedure("is_email_in_use", [email])
		.then((response) => response[0].is_email_in_use);
}

function sendVerificationEmail(verificationToken, email) {
	const htmlBody = "<p>In order to use OSTeams, "
		+ `click on the following link <a href="${websiteConfig.hostname}:${websiteConfig.port}/account/verifyEmail?token=${verificationToken}">link</a> `
		+ "to verify your email address</p>";
	return mailer.SendMail(email, "Email verification - OSTeams", htmlBody);
}

function addUnverifiedUserToDB(email, encryptedPassword, verificationToken) {
	return pgConnector.executeStoredProcedure("add_unverified_user", [
		"",
		"",
		email.toLowerCase(),
		encryptedPassword,
		verificationToken,
	]);
}

function generateToken() {
	const tokenLength = 50;
	const verificationToken = randToken.generate(tokenLength);
	return verificationToken;
}

function hashPassword(password) {
	const saltLength = 10;
	return bcrypt.hashSync(password, saltLength);
}

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

		return checkEmailUsed(email).then(async (isUsed) => {
			if (isUsed) {
				return res.render("register", { error: "The provided email is already in use." });
			}

			const encryptedPassword = hashPassword(password);
			const verificationToken = generateToken();

			await addUnverifiedUserToDB(email, encryptedPassword, verificationToken);
			const response = await sendVerificationEmail(verificationToken, email);
			return res.render("register", { hint: response });
		});
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
export {
	hashPassword,
	generateToken,
	checkEmailUsed,
	addUnverifiedUserToDB,
	sendVerificationEmail,
};
