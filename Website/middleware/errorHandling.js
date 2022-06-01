import websiteConfig from "../config/website.config.js";

export default (err, req, res, next) => {
	console.error(err.message);
	req.flash("error", "An internal error has occurred.");
	return res.redirect("/");
};
