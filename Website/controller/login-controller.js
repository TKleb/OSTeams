import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pgConnector } from "../services/pg-connector.js";
import config from "../config/auth.config.js";

export class LoginController {
	index(req, res) {
		res.render("login", { title: "login" });
	}

	async login(req, res) {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.render("login", { error: "Please provide email and password" });
		}

		const userRow = await pgConnector.executeStoredProcedure("get_userbyemail", [email]);
		if (userRow.length === 0) {
			return res.render("login", { error: "Invalid credentials" });
		}

		const user = userRow[0];
		if (await bcrypt.compare(password, user.passwordhash)) {
			const token = jwt.sign(
				{ user_id: user.id, email },
				config.secret,
				{
					expiresIn: "2h",
				},
			);

			res.cookie("token", token, {
				httpOnly: true,
				sameSite: true,
				maxAge: 1000 * 60 * 60 * 4, // would expire after 2 hours
			});
			return res.render("index", { hint: "Successfully logged in" });
		}
		return res.render("login", { error: "Invalid credentials" });
	}
}

export const loginController = new LoginController();
