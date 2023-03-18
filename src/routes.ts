import * as express from "express";
import { post } from "./controllers/backoffice/api/register";

const routes = express.Router();
const backOfficeRoutes = express.Router();
const backOfficeApiRoutes = express.Router();

routes.use("/backoffice", backOfficeRoutes);
backOfficeRoutes.use("/api", backOfficeApiRoutes);

backOfficeApiRoutes.post("/register", post);

export = routes;
