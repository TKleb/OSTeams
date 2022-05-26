const isAuthenticated = (req, res, next) => {
	const isLoggedIn = req.session?.loggedIn;

	if (!isLoggedIn) {
		return res.render("login", { hint: "You have to log in before using this site." });
	}
	return next();
};

const isUnauthenticated = (req, res, next) => {
	const isLoggedIn = req.session?.loggedIn;

	if (isLoggedIn) {
		req.flash("hint", "This site cannot be accessed while logged in");
		return res.redirect("/");
	}
	return next();
};

export {
	isAuthenticated,
	isUnauthenticated,
};
