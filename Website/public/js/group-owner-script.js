import { openModal, closeModal } from "./script.js";

const deleteGroupButton = document.getElementById("delete-group-button");
const cancelGroupDelete = document.getElementById("cancel-delete-group-button");
const kickMemberButton = document.getElementById("kick-member-button");
const cancelMemberKick = document.getElementById("cancel-kick-member-button");

cancelGroupDelete?.addEventListener("click", () => {
	const modal = cancelGroupDelete.closest(".modal");
	closeModal(modal);
});

deleteGroupButton?.addEventListener("click", () => {
	const modal = document.querySelector(deleteGroupButton.dataset.modalTarget);
	openModal(modal);
});

cancelMemberKick?.addEventListener("click", () => {
	const modal = cancelMemberKick.closest(".modal");
	closeModal(modal);
});

kickMemberButton?.addEventListener("click", () => {
	const modal = document.querySelector(kickMemberButton.dataset.modalTarget);
	openModal(modal);
});
