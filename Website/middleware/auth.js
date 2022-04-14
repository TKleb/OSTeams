import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";

const verifyToken = (req, res, next) => {
	const { token } = req.cookies.token;

	if (!token) {
		return res.render("login", { hint: "You have to log in before using this site." });
	}
	try {
		const decoded = jwt.verify(token, config.secret);
		req.user = decoded;
	} catch (err) {
		return res.render("login", { hint: "You have to log in before using this site." });
	}
	return next();
};

export default verifyToken;
