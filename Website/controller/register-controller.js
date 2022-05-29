import bcrypt from "bcryptjs";
import randToken from "rand-token";
import mailer from "../services/mailer.js";
import pgConnector from "../services/pg-connector.js";
import websiteConfig from "../config/website.config.js";
import { isEmailAddressValid, isPasswordValid, inputValidationSettings } from "../utils/input-validation-util.js";

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
			title: "register",
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			emailRegex: inputValidationSettings.emailVerificationRegex,
			maxPasswordLength: inputValidationSettings.maxPasswordLength,
			minPasswordLength: inputValidationSettings.minPasswordLength,
		});
	}

	async register(req, res) {
		const {
			email,
			password,
			passwordConfirmation,
		 } = req.body;

		if (!email || !passwordConfirmation || !isPasswordValid(password)) {
			return res.render("register", { error: "Please provide email and password." });
		}

		if (password !== passwordConfirmation) {
			return res.render("register", { error: "Provided passwords don't match." });
		}

		if (!isEmailAddressValid(email)) {
			return res.render("register", { error: "E-Mail Address isn't an OST address." });
		}

		const isEmailInUse = await pgConnector.isEmailInUse(email);
		if (isEmailInUse) {
			return res.render("register", { error: "The provided email is already in use." });
		}

		const encryptedPassword = hashPassword(password);
		const verificationToken = generateToken();
		await addUnverifiedUserToDB(email, encryptedPassword, verificationToken);
		const response = await sendVerificationEmail(verificationToken, email);
		return res.render("login", { hint: response });
	}

	async verifyMail(req, res) {
		const verificationToken = req.query.token;

		if (!verificationToken) {
			return res.send("Invalid token");
		}

		await pgConnector.executeStoredProcedure("do_verify_user", [verificationToken])
		return res.render("index", { hint: "Email verified successfully" });
	}
}

export default new RegisterController();
export {
	hashPassword,
	generateToken,
	addUnverifiedUserToDB,
	sendVerificationEmail,
};
