export class ModuleController {
    module(req, res) {
        res.render("module", {title: "Module"});
    };
}

export const moduleController = new ModuleController();