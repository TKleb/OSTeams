import { searchElements } from "./search-script.js";

const nameField = document.getElementsByClassName("group-name");
const ownerEmail = document.getElementsByClassName("group-owner");
const searchBar = document.getElementById("searchbar");
const elements = document.getElementsByClassName("group");
const createGroupApplyByDate = document.getElementById("create-group-applydate");

/* eslint prefer-destructuring: ["error", {AssignmentExpression: {array: false}}] */
if (createGroupApplyByDate) {
	const currentDate = new Date();
	const oneYearFromNow = new Date();
	oneYearFromNow.setFullYear(currentDate.getFullYear() + 1);
	createGroupApplyByDate.min = currentDate.toISOString().split("T")[0];
	createGroupApplyByDate.max = oneYearFromNow.toISOString().split("T")[0];
}

searchBar.addEventListener("keyup", searchElements(searchBar, elements, nameField, ownerEmail));
