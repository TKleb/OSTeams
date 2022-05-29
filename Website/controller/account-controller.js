import pgConnector from "../services/pg-connector.js";
import {
	isCustomInfoValid,
	isSurnameValid,
	isStartYearValid,
	isNameValid,
} from "../utils/input-validation-util.js";

class AccountController {
	async index(req, res) {
		const currentUser = await pgConnector.getUserByEmail(req.session.email);
		res.render("account", {
			title: "Account",
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			edit: false,
			user: currentUser,
			isOwnProfile: true
		});
	}

	async showSpecificUserInfo(req, res) {
		const { id } = req.params;
		const currentUserData = await pgConnector.getUserById(id);
		const isOwnProfile = id === req.session.userId;
		res.render("account", {
			title: "Account",
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			edit: false,
			user: currentUserData,
			isOwnProfile
		});
	}

	logout(req, res) {
		req.session.destroy();
		res.redirect("/");
	}

	async edit(req, res) {
		const currentUser =  await pgConnector.getUserByEmail(req.session.email);
		res.render("account", {
			title: "Edit",
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			edit: true,
			user: currentUser
		});
	}

	async update(req, res) {
		const {
			surname,
			name,
			startYear,
			fulltime,
			info
		} = req.body;

		if (!isSurnameValid(surname)
			|| !isNameValid(name)
			|| !isStartYearValid(startYear)
			|| !isCustomInfoValid(info)
		) {
			req.flash("error", "Invalid input");
			return res.redirect("/");
		}
		let isFulltime = undefined;
		if (fulltime) {
			isFulltime = fulltime === "true";
		}

		const options = [
			req.session.id,
			name,
			surname,
			group.subject_id,
			description,
			maxMemberCount,
			applyByDate,
			group.closed,
		];
		await pgConnector.editUserById(options);

		req.flash("success", "Account details saved successfully");
		res.redirect("/account")
	}
}

export default new AccountController();
