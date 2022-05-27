function isNumeric(val) {
	return /^\d+$/.test(val);
}

function areNumeric(...values) {
	return values.every(isNumeric);
}

export {
	isNumeric,
	areNumeric,
};
