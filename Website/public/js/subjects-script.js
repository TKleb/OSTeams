const subjectText = document.getElementsByClassName("subject-name");
const searchInput = document.getElementById("searchbar");
const subjectBox = document.getElementsByClassName("subject");

function searchSubject() {
	let input = searchInput.value;
	input = input.toLowerCase();
	for (let i = 0; i < subjectText.length; i += 1) {
		if (!subjectText[i].innerHTML.toLowerCase().includes(input)) {
			subjectBox[i].style.display = "none";
		} else {
			subjectBox[i].style.display = "flex";
		}
	}
}

searchInput.addEventListener("keyup", searchSubject);
