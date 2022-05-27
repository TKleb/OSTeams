import { openModal, closeModal } from "./script.js";

const deleteGroupButton = document.getElementById("delete-group-button");
const cancelGroupDelete = document.getElementById("cancel-delete-group-button");

cancelGroupDelete.addEventListener("click", () => {
	const modal = cancelGroupDelete.closest(".modal");
	closeModal(modal);
});

deleteGroupButton.addEventListener("click", () => {
	const modal = document.querySelector(deleteGroupButton.dataset.modalTarget);
	openModal(modal);
});
