export class LoginController {
    login(req, res) {
        res.render("login", {title: "Login"});
    };

    register(req, res) {
        res.render("register", {title: "register"})
    }

    forgotPw(req, res) {
        res.render("forgotPassword", {title: "forgot"})
    }
}

export const loginController = new LoginController();