import config from "./utils/config";
import express, { Express } from "express";
import routes from "./routes";
import path from "path";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

const app: Express = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const port = config.port;

app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize());

app.use("/", routes);

app.use("*", function (_req: express.Request, res: express.Response) {
    res.render("404");
});

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});
