import { openModal, closeModal } from "./script.js";

const deleteGroupButton = document.getElementById("delete-group-btn");
const cancelGroupDelete = document.getElementById("cancel-delete-modal");

cancelGroupDelete.addEventListener("click", () => {
	const modal = cancelGroupDelete.closest(".modal");
	closeModal(modal);
});

deleteGroupButton.addEventListener("click", () => {
	const modal = document.querySelector(deleteGroupButton.dataset.modalTarget);
	openModal(modal);
});
