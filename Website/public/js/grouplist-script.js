const groupText = document.getElementsByClassName("group-name");
const searchInput = document.getElementById("searchbar");
const groupBox = document.getElementsByClassName("group");

function searchGroup() {
	let input = searchInput.value;
	input = input.toLowerCase();
	for (let i = 0; i < groupText.length; i += 1) {
		if (!groupText[i].innerHTML.toLowerCase().includes(input)) {
			groupBox[i].style.display = "none";
		} else {
			groupBox[i].style.display = "grid";
		}
	}
}

searchInput.addEventListener("keyup", searchGroup);
