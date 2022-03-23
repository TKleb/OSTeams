export class IndexController {
    index(req, res) {
        res.render("index", {data: "Hello World", dark: false});
    };
}

export const indexController = new IndexController();
