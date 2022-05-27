import { searchElements } from "./search-script.js";

const nameField = document.getElementsByClassName("group-name");
const searchBar = document.getElementById("searchbar");
const elements = document.getElementsByClassName("group");
const createGroupApplyByDate = document.getElementById("create-group-applydate");

if (createGroupApplyByDate) {
	const currentDate = new Date();
	var oneYearFromNow = new Date();
	oneYearFromNow.setFullYear(currentDate.getFullYear() + 1);
	createGroupApplyByDate.min = currentDate.toISOString().split("T")[0];
	createGroupApplyByDate.max = oneYearFromNow.toISOString().split("T")[0];
}

searchBar.addEventListener("keyup", searchElements(nameField, searchBar, elements));
