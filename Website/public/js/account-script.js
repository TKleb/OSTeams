// Account Page Magic
const editButton = document.getElementById("start-account-edit");
const saveAndReturnButton = document.querySelectorAll(".acc-edit-btn");
const infoInput = document.querySelectorAll(".info-input");

const form = document.getElementById("account-info-form");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	infoInput.forEach((input) => {
		console.log(input.value);
	});
});

// Disable eslint because of "no-param-reassign" Error
/* eslint-disable */
editButton.addEventListener("click", () => {
	saveAndReturnButton.forEach((button) => {
		button.style.display = "block";
		editButton.style.display = "none";
	});
	infoInput.forEach((input) => {
		input.removeAttribute("disabled");
	});
});


saveAndReturnButton.forEach((b) => {
	b.addEventListener("click", () => {
		saveAndReturnButton.forEach((button) => {
			button.style.display = "none";
			editButton.style.display = "block";
		});
		infoInput.forEach((input) => {
			input.setAttribute("disabled", "");
		});
	});
});
/* eslint-enable */
