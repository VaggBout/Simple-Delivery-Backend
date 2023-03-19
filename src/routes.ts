import * as express from "express";
import { post } from "./controllers/backoffice/api/register";
import { registerValidator } from "./middlewares/validators";

const routes = express.Router();
const backOfficeRoutes = express.Router();
const backOfficeApiRoutes = express.Router();

routes.use("/backoffice", backOfficeRoutes);
backOfficeRoutes.use("/api", backOfficeApiRoutes);

backOfficeApiRoutes.post("/register", registerValidator, post);

export = routes;
