import { pgConnector } from "../services/pg-connector.js";

export class ModuleController {
	index(req, res) {
		res.render("module");
	}

	async module(req, res) {
		pgConnector.executeStoredProcedure("get_subjects")
			.then((subjects) => {
				res.render("module", { modules: subjects });
			}).catch((err) => {
				res.render("module", { modules: [], error: err });
			});
	}
}

export const moduleController = new ModuleController();
