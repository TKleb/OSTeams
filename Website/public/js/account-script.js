import { openModal, closeModal } from "./script.js";

// Account Page Magic
const dateDropdown = document.getElementById("date-dropdown");
const deleteAccountButton = document.getElementById("delete-account-button");
const cancelAccountDelete = document.getElementById("cancel-delete-account-button");

let currentYear = new Date().getFullYear();
const earliestYear = 2015;

while (currentYear >= earliestYear) {
	const dateOption = document.createElement("option");
	dateOption.text = currentYear;
	dateOption.value = currentYear;
	dateDropdown.add(dateOption);
	currentYear -= 1;
}

cancelAccountDelete?.addEventListener("click", () => {
	const modal = cancelAccountDelete.closest(".modal");
	closeModal(modal);
});

deleteAccountButton?.addEventListener("click", () => {
	const modal = document.querySelector(deleteAccountButton.dataset.modalTarget);
	openModal(modal);
});
