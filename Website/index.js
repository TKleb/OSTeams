import dotenv from "dotenv";
import websiteConfig from "./config/website.config.js"

// load config-file
dotenv.config({ path: `.env${process.env.NODE_ENV ? `-${process.env.NODE_ENV}` : ""}` });

// load app with current config
const { app } = await import("./app.js");

export default app.listen(websiteConfig.port, "0.0.0.0", () => {
	console.log(`Server running at ${websiteConfig.hostname}:${websiteConfig.port}/`);
});
