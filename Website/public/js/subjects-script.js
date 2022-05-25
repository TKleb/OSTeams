import { searchElements } from "./search-script.js";

const nameField = document.getElementsByClassName("subject-name");
const searchBar = document.getElementById("searchbar");
const elements = document.getElementsByClassName("subject");

searchBar.addEventListener("keyup", searchElements(nameField, searchBar, elements));
