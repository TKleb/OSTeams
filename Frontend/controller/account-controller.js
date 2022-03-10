export class AccountController {
    account(req, res) {
        res.render("account", {title: "Account"});
    };
}

export const accountController = new AccountController();
