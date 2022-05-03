export default (err, req, res, next) => {
	req.flash("error", err.message);
	res.redirect(req.url);
	return next();
};
