class GroupController {
	index(req, res) {
		const { abbreviation } = req.params;
		res.render("groups", { title: "Groups", abbr: abbreviation });
	}
}

export default new GroupController();
