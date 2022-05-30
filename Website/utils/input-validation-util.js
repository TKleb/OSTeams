const inputValidationSettings = {
	emailVerificationRegex: "^[A-z0-9.-]{1,33}@ost\\.ch$",
	minMemberCount: 2,
	maxMemberCount: 99,
	maxGroupNameLenght: 50,
	maxGroupDescriptionLength: 512,
	maxPasswordLength: 30,
	minPasswordLength: 5,
	maxApplicationTextLength: 200,
	maxNameLength: 30,
	maxSurnameLength: 30,
	maxCustomInfoLength: 512,
};

function isEmailAddressValid(email) {
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

function isPasswordValid(password) {
	return password?.length <= inputValidationSettings.maxPasswordLength
		&& password?.length >= inputValidationSettings.minPasswordLength;
}

function isApplicationTextValid(text) {
	return text?.length <= inputValidationSettings.maxApplicationTextLength;
}

export {
	isNumeric,
	areNumeric,
	isApplyByDateValid,
	isMaxMemberCountValid,
	isGroupDescriptionValid,
	isGroupNameValid,
	isEmailAddressValid,
	isPasswordValid,
	isApplicationTextValid,
	isSurnameValid,
	isNameValid,
	isStartYearValid,
	isCustomInfoValid,
	inputValidationSettings,
};
