// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
	console.error(err.message);
	req.flash("error", "An internal error has occurred.");
	return res.redirect("/");
};
