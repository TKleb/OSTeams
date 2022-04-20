class IndexController {
	index(req, res) {
		res.render("index", { data: "Hello World", dark: false });
	}
}

export default new IndexController();
