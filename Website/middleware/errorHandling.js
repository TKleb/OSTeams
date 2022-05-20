import websiteConfig from "../config/website.config.js";

export default (err, req, res, next) => {
	req.flash("error", err.message);
	res.redirect(`${websiteConfig.hostname}:${websiteConfig.port}`);
	return next();
};
