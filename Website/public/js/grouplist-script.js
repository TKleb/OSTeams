import { searchElements } from "./search-script.js";

const nameField = document.getElementsByClassName("group-name");
const searchBar = document.getElementById("searchbar");
const elements = document.getElementsByClassName("group");

searchBar.addEventListener("keyup", searchElements(nameField, searchBar, elements));
