import pgConnector from "../services/pg-connector.js";
import {
	isNumeric,
	isCustomInfoValid,
	isSurnameValid,
	isStartYearValid,
	isNameValid,
	inputValidationSettings,
} from "../utils/input-validation-util.js";

class AccountController {
	async index(req, res) {
		return res.redirect("/account/".concat(req.session.userId));
	}

	async showAccountById(req, res) {
		const { id } = req.params;

		if (!isNumeric) {
			req.flash("error", "Invalid input");
			return res.redirect("/");
		}

		const currentUserData = await pgConnector.getUserById(id);
		const radix = 10;
		const isOwnProfile = parseInt(id, radix) === req.session.userId;
		return res.render("account", {
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			edit: false,
			user: currentUserData,
			isOwnProfile,
		});
	}

	logout(req, res) {
		req.session.destroy();
		res.redirect("/");
	}

	async edit(req, res) {
		const currentUser = await pgConnector.getUserByEmail(req.session.email);
		res.render("editAccount", {
			title: "Edit",
			hint: req.flash("hint"),
			error: req.flash("error"),
			success: req.flash("success"),
			user: currentUser,
			isOwnProfile: true,
			surnameLength: inputValidationSettings.maxSurnameLength,
			nameLength: inputValidationSettings.maxNameLength,
			customInfoLength: inputValidationSettings.maxCustomInfoLength,
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
		let isFulltime;
		if (fulltime) {
			isFulltime = fulltime === "true";
		}

		const options = [
			req.session.userId,
			name,
			surname,
			info,
			isFulltime,
			startYear,
		];

		await pgConnector.editUserById(options);
		req.flash("success", "Account details saved successfully");
		return res.redirect(`/account/edit/${req.session.userId}`);
	}

	async delete(req, res) {
		const isGroupRemoved = await pgConnector.removeUser(req.session.userId);
		if (!isGroupRemoved) {
			req.flash("error", "Couldn't delete user");
			return res.redirect("/");
		}
		req.flash("success", "Account successfully deleted");
		req.session.destroy();
		return res.redirect("/");
	}
}

export default new AccountController();
