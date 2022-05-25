// Filter UI-elements based on their text, according to the content of a searchbar
function searchElements(textField, searchBar, elements) {
	return () => {
		let input = searchBar.value.toLowerCase();
		for (let i = 0; i < text.length; i += 1) {
			if (!textField[i].innerHTML.toLowerCase().includes(input)) {
				elements[i].style.display = "none";
			} else {
				elements[i].style.display = "flex";
			}
		}
	}
}

export {
	searchElements,
};
