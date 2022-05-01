class IndexController {
	index(req, res) {
		res.render("index", { data: "Hello World", hint: req.flash("hint"), error: req.flash("error"), success: req.flash("success") });
	}
}

export default new IndexController();
