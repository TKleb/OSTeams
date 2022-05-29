const helpers = {
	'if_eq': function (a, b, opts) {
		if (a === b)
			return opts.fn(this);
		else
			return opts.inverse(this);
	},
	'if_and': function (a, b, opts) {
		if (a && b)
			return opts.fn(this);
		else
			return opts.inverse(this);
	},
	'if_memberIsNotGroupOwner': function (userId, group, opts) {
		if (userId !== group.owner_id)
			return opts.fn(this);
		else
			return opts.inverse(this);
	},
	'timestampToDate': function(timestamp) {
		return timestamp.toISOString().split("T")[0];
	},
}

export default helpers;
