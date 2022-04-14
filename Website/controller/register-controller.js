import bcrypt from "bcryptjs";
import { pgConnector } from "../services/pg-connector.js";

export class RegisterController {
	index(req, res) {
		res.render("register", { title: "register" });
	}

	async register(req, res) {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.render("login", { error: "Please provide email and password." });
		}

		const isEmailInUseRow = await pgConnector.executeStoredProcedure("is_emailinuse", [email]);
		if (isEmailInUseRow[0].is_emailinuse) {
			return res.render("login", { error: "The provided email is already in use." });
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
			return res.render("login", { error: "There was an error creating your account." });
		}

		return res.render("index", { hint: "Account created successfully."});
	}
}

export const registerController = new RegisterController();
