import * as express from "express";

import * as BackofficeRegisterApiController from "./controllers/backoffice/api/register";
import * as BackofficeLoginApiController from "./controllers/backoffice/api/login";
import * as BackofficeStoresApiController from "./controllers/backoffice/api/stores";
import * as BackofficeCategoriesApiController from "./controllers/backoffice/api/categories";

import * as StoresApiController from "./controllers/api/stores";
import * as MenuApiController from "./controllers/api/menu";
import * as OrderApiController from "./controllers/api/order";

import * as Validators from "./middlewares/validators";
import * as UserMiddleware from "./middlewares/user";

const routes = express.Router();
const backOfficeRoutes = express.Router();
const backOfficeApiRoutes = express.Router();
const apiRoutes = express.Router();

routes.use("/backoffice", backOfficeRoutes);
routes.use("/api", apiRoutes);

apiRoutes.get("/stores", StoresApiController.get);
apiRoutes.get(
    "/stores/:id/menu",
    Validators.IdParamValidator,
    Validators.CurrencyQueryValidator,
    MenuApiController.get
);
apiRoutes.post(
    "/stores/:id/orders",
    Validators.IdParamValidator,
    Validators.createOrderValidator,
    OrderApiController.post
);

backOfficeRoutes.use("/api", backOfficeApiRoutes);

backOfficeApiRoutes.post(
    "/register",
    Validators.registerValidator,
    BackofficeRegisterApiController.post
);
backOfficeApiRoutes.post(
    "/login",
    Validators.loginValidator,
    BackofficeLoginApiController.post
);
backOfficeApiRoutes.post(
    "/stores",
    Validators.createStoreValidator,
    UserMiddleware.populateAuthUser,
    BackofficeStoresApiController.post
);
backOfficeApiRoutes.patch(
    "/stores/:id/publish",
    Validators.IdParamValidator,
    UserMiddleware.populateAuthUser,
    BackofficeStoresApiController.publish
);
backOfficeApiRoutes.post(
    "/categories",
    Validators.createCategoryValidator,
    UserMiddleware.populateAuthUser,
    BackofficeCategoriesApiController.post
);

export = routes;
