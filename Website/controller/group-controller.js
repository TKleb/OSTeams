export class GroupController {
	index(req, res) {
		const { abbreviation } = req.params;
		res.render("groups", { title: "Groups", abbr: abbreviation });
	}
}

export const groupController = new GroupController();
