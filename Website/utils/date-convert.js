function timestampToDisplayString(timestamp) {
	const dateOptions = {
		day: "numeric",
		month: "long",
		year: "numeric"
	};
	return new Date(timestamp).toLocaleDateString("en-GB", dateOptions);
}

export {
	timestampToDisplayString
};
