/* eslint prefer-destructuring: ["error", {AssignmentExpression: {array: false}}] */
function setMinMaxApplyByDate(control) {
	const currentDate = new Date();
	const oneYearFromNow = new Date();
	oneYearFromNow.setFullYear(currentDate.getFullYear() + 1);
	control.min = currentDate.toISOString().split("T")[0];
	control.max = oneYearFromNow.toISOString().split("T")[0];
}

export {
	setMinMaxApplyByDate,
};
