export const saveSessionToLocals = (req, res, next) => {
	res.locals.session = req.session;
	return next();
};
