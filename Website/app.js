/* eslint-disable no-tabs */
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";

import indexRoutes from "./routes/index-routes.js";
import subjectsRouter from "./routes/subjects-routes.js";
import accountRouter from "./routes/account-routes.js";
import teamsRouter from "./routes/teams-routes.js";
import helpers from "./utils/handlebar-util.js";
import sessionUserSettings from "./utils/session-middleware.index.js";
import saveSessionToLocals from "./middleware/saveSessionToLocals.js";
import auth from "./middleware/auth.js";

export const app = express();

const hbs = exphbs.create({
	extname: ".hbs",
	defaultLayout: "default",
	helpers: {
		...helpers,
	},
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.resolve("views"));

app.use(express.static(path.resolve("public")));
app.use(session({ secret: "casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda", resave: false, saveUninitialized: true }));
app.use(sessionUserSettings);
app.use(saveSessionToLocals);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", indexRoutes);
app.use("/account", accountRouter);
app.use("/subjects", auth, subjectsRouter);
app.use("/teams", auth, teamsRouter);
