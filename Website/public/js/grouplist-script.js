import { searchElements } from "./search-script.js";
import { setMinMaxApplyByDate } from "./apply-by-date-script.js";

const nameField = document.getElementsByClassName("content-title");
const ownerEmail = document.getElementsByClassName("group-owner");
const searchBar = document.getElementById("searchbar");
const elements = document.getElementsByClassName("group");
const createGroupApplyByDate = document.getElementById("create-group-applydate");

if (createGroupApplyByDate) {
	setMinMaxApplyByDate(createGroupApplyByDate);
}

searchBar.addEventListener("keyup", searchElements(searchBar, elements, nameField, ownerEmail));
