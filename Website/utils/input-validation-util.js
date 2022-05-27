function isNumeric(val) {
	return /^\d+$/.test(val);
}

function areNumeric(...values) {
	return values.every(isNumeric);
}

function isApplyByDateValid(date) {
	const currDate = new Date();
	currDate.setHours(0, 0, 0, 0);
	const maxDate = new Date();
	maxDate.setFullYear(currDate.getFullYear() + 1);
	const applyByDate = new Date(date);
	return applyByDate >= currDate && applyByDate <= maxDate;
}

export {
	isNumeric,
	areNumeric,
	isApplyByDateValid,
};
