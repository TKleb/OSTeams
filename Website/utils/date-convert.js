function convertAndAddDate(list) {
	list.forEach((group) => {
		const date = new Date(group.apply_by_date);
		const dateOptions = {
			day: "numeric",
			month: "long",
			year: "numeric"
		};
		group.convertedDate = date.toLocaleDateString("en-GB", dateOptions);
	});
	return list;
}

export {
	convertAndAddDate
};
