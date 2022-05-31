import dotenv from "dotenv";
import websiteConfig from "./config/website.config.js";

// load config-file
dotenv.config({ path: `.env${process.env.NODE_ENV ? `-${process.env.NODE_ENV}` : ""}` });

// load app with current config
const { app } = await import("./app.js");

// 0.0.0.0 to bind to the host's address, does not need to be set via config.
export default app.listen(websiteConfig.port, "0.0.0.0", () => {
	console.log(`Server running at ${websiteConfig.hostnameDisplay}/`);
});
