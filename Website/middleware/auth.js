export const auth = (req, res, next) => {
	const isLoggedIn = req.session?.loggedIn;

	if (!isLoggedIn) {
		return res.render("login", { hint: "You have to log in before using this site." });
	}
	return next();
};
