import * as express from "express";
import * as RegisterApiController from "./controllers/backoffice/api/register";
import * as LoginApiController from "./controllers/backoffice/api/login";
import { loginValidator, registerValidator } from "./middlewares/validators";

const routes = express.Router();
const backOfficeRoutes = express.Router();
const backOfficeApiRoutes = express.Router();

routes.use("/backoffice", backOfficeRoutes);
backOfficeRoutes.use("/api", backOfficeApiRoutes);

backOfficeApiRoutes.post(
    "/register",
    registerValidator,
    RegisterApiController.post
);

backOfficeApiRoutes.post("/login", loginValidator, LoginApiController.post);

export = routes;
