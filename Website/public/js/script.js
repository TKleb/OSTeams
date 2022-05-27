const applyToGroupButtons = document.querySelectorAll(".apply");
const closeModalButtons = document.querySelectorAll(".close-button");
const overlay = document.querySelector(".overlay");
const createGroupButton = document.querySelectorAll(".create-group");
const viewApplication = document.querySelectorAll(".view-application");
const groupPanels = document.querySelectorAll(".group");

// eslint-disable-next-line consistent-return
function openModal(modal) {
	if (modal == null) {
		return null;
	}
	modal.classList.add("active");
	overlay.classList.add("active");
	groupPanels.forEach((panel) => {
		panel.classList.add("no-hover");
	});
}

// eslint-disable-next-line consistent-return
function closeModal(modal) {
	if (modal == null) {
		return null;
	}
	modal.classList.remove("active");
	overlay.classList.remove("active");
	groupPanels.forEach((panel) => {
		panel.classList.remove("no-hover");
	});
}

viewApplication.forEach((button) => {
	button.addEventListener("click", () => {
		const modal = document.querySelector(button.dataset.modalTarget);
		openModal(modal);
	});
});

applyToGroupButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const modal = document.querySelector(button.dataset.modalTarget);
		openModal(modal);
	});
});

createGroupButton.forEach((button) => {
	button.addEventListener("click", () => {
		const modal = document.querySelector(button.dataset.modalTarget);
		openModal(modal);
	});
});

closeModalButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const modal = button.closest(".modal");
		closeModal(modal);
	});
});

export {
	openModal,
	closeModal
};
