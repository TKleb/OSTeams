class GroupListController {
	index(req, res) {
		const { abbreviation } = req.params;
		res.render("grouplist", { title: "Groups", abbr: abbreviation });
	}
}

export default new GroupListController();
