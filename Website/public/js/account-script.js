// Account Page Magic
const dateDropdown = document.getElementById("date-dropdown");

let currentYear = new Date().getFullYear();
const earliestYear = 2015;

while (currentYear >= earliestYear) {
	const dateOption = document.createElement("option");
	dateOption.text = currentYear;
	dateOption.value = currentYear;
	dateDropdown.add(dateOption);
	currentYear -= 1;
}
