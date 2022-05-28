// Filter UI-elements based on their text, according to the content of a searchbar
function searchElements(searchBar, elements, textField, additionalSearch) {
	return () => {
		const input = searchBar.value.toLowerCase();
		if (additionalSearch === "undefined") {
			for (let i = 0; i < textField.length; i += 1) {
				if (!textField[i].innerHTML.toLowerCase().includes(input)) {
					elements[i].style.display = "none";
				} else {
					elements[i].style.display = "grid";
				}
			}
		} else {
			for (let i = 0; i < textField.length; i += 1) {
				if (!(textField[i].innerHTML.toLowerCase().includes(input)
					|| additionalSearch[i].innerHTML.toLowerCase().includes(input))) {
					elements[i].style.display = "none";
				} else {
					elements[i].style.display = "grid";
				}
			}
		}
	};
}

export {
	searchElements,
};
