const applyToGroupButtons = document.querySelectorAll(".apply");
const closeModalButtons = document.querySelectorAll(".close-button");
const overlay = document.getElementById("overlay");
const createGroupButton = document.querySelectorAll(".create-group");

// eslint-disable-next-line consistent-return
function openModal(modal) {
	if (modal == null) {
		return null;
	}
	modal.classList.add("active");
	overlay.classList.add("active");
}

// eslint-disable-next-line consistent-return
function closeModal(modal) {
	if (modal == null) {
		return null;
	}
	modal.classList.remove("active");
	overlay.classList.remove("active");
}

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
