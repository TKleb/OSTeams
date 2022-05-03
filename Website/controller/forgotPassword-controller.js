class ForgotPasswordController {
	index(req, res) {
		res.render("forgotPassword", { title: "forgotPassword" });
	}

	forgotPassword(req, res) {
		res.render("forgotPassword", { title: "forgotPassword" });
	}
}

export default new ForgotPasswordController();
