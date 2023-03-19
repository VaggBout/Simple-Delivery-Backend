import * as express from "express";

import * as RegisterApiController from "./controllers/backoffice/api/register";
import * as LoginApiController from "./controllers/backoffice/api/login";
import * as StoresApiController from "./controllers/backoffice/api/stores";
import * as CategoriesApiController from "./controllers/backoffice/api/categories";

import * as Validators from "./middlewares/validators";
import * as UserMiddleware from "./middlewares/user";

const routes = express.Router();
const backOfficeRoutes = express.Router();
const backOfficeApiRoutes = express.Router();

routes.use("/backoffice", backOfficeRoutes);
backOfficeRoutes.use("/api", backOfficeApiRoutes);

backOfficeApiRoutes.post(
    "/register",
    Validators.registerValidator,
    RegisterApiController.post
);
backOfficeApiRoutes.post(
    "/login",
    Validators.loginValidator,
    LoginApiController.post
);
backOfficeApiRoutes.post(
    "/stores",
    Validators.createStoreValidator,
    UserMiddleware.populateAuthUser,
    StoresApiController.post
);
backOfficeApiRoutes.post(
    "/categories",
    Validators.createCategoryValidator,
    UserMiddleware.populateAuthUser,
    CategoriesApiController.post
);

export = routes;
