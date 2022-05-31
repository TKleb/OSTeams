export default {
	host: process.env.DB_DNS_NAME,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
	user: process.env.DB_BACKEND_USER,
	password: process.env.DB_BACKEND_PASSWORD,
	max: 30,
};
