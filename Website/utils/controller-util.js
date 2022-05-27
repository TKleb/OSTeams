function isApplyByDateValid(date) {
	const currDate = new Date();
	currDate.setHours(0, 0, 0, 0);
	const maxDate = new Date();
	maxDate.setFullYear(currDate.getFullYear() + 1);
	const applyByDate = new Date(date);
	return applyByDate >= currDate && applyByDate <= maxDate;
}

export {
	isApplyByDateValid
};
