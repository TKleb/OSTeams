const password = document.getElementById("id-password");
const confirmPassword = document.getElementById("id-passwordConfirmation");

function validatePassword() {
	if (password.value !== confirmPassword.value) {
		confirmPassword.setCustomValidity("Passwords Don't Match");
	} else {
		confirmPassword.setCustomValidity("");
	}
}

password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;
