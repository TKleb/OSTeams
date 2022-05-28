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

function isMaxMemberCountValid(maxMemberCount) {
	return isNumeric(maxMemberCount) && maxMemberCount <= 99 && maxMemberCount >= 2;
}

function isGroupDescriptionValid(description) {
	return description?.length <= 512;
}

function isGroupNameValid(name) {
	return name?.length <= 50;
}

export {
	isNumeric,
	areNumeric,
	isApplyByDateValid,
	isMaxMemberCountValid,
	isGroupDescriptionValid,
	isGroupNameValid,
};
