export class AccountController {
    index(req, res) {
        res.render("account", {title: "Account"});
    };
}

export const accountController = new AccountController();
