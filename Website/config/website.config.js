function generateDisplayName() {
	// DisplayName is a stand-in for a reverse-proxy. We just need a valid URL to give users.
	const domain = process.env.DOMAIN;
	if (!domain || domain === "localhost") {
		return "http://localhost:3001";
	}
	return domain;
}

export default {
	hostnameDisplay: generateDisplayName(),
	hostname: "localhost",
	port: "3001",
};
