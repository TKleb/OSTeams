const inputValidationSettings = {
	emailVerificationRegex: "^[A-z0-9.-]+@ost\\.ch$",
	minMemberCount: 2,
	maxMemberCount: 99,
	maxGroupNameLenght: 50,
	maxGroupDescriptionLength: 512,
	maxNameLength: 30,
	maxSurnameLength: 30,
	maxCustomInfoLength: 512,
};

function isValidEmailAddress(email) {
	return new RegExp(inputValidationSettings.emailVerificationRegex)
		.test(email);
}

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

function isMaxMemberCountValid(meberCount) {
	return isNumeric(meberCount)
		&& meberCount <= inputValidationSettings.maxMemberCount
		&& meberCount >= inputValidationSettings.minMemberCount;
}

function isGroupDescriptionValid(description) {
	return description?.length <= inputValidationSettings.maxGroupDescriptionLength;
}

function isGroupNameValid(name) {
	return name?.length <= inputValidationSettings.maxGroupNameLenght;
}

function isSurnameValid(surname) {
	return surname.length <= inputValidationSettings.maxSurnameLength;
}

function isNameValid(name) {
	return name.length <= inputValidationSettings.maxNameLength;
}

function isStartYearValid(year) {
	return isNumeric(year);
}

function isCustomInfoValid(info) {
	return info.length <= inputValidationSettings.maxCustomInfoLength;
}

export {
	isNumeric,
	areNumeric,
	isApplyByDateValid,
	isMaxMemberCountValid,
	isGroupDescriptionValid,
	isGroupNameValid,
	isValidEmailAddress,
	isSurnameValid,
	isNameValid,
	isStartYearValid,
	isCustomInfoValid,
	inputValidationSettings,
};
