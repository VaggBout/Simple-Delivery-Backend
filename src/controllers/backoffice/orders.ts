import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import * as OrderService from "../../services/order";
import * as StoreService from "../../services/store";
import logger from "../../utils/logger";

export async function get(req: Request, res: Response): Promise<void> {
    if (!res.locals.user) {
        res.redirect("/backoffice/login");
        return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.redirect("404");
        return;
    }

    const storeId = req.params.id as unknown as Types.ObjectId;
    try {
        const storeResult = await StoreService.getStoreByOwnerId(
            res.locals.user.id
        );

        if (storeResult.error) {
            res.redirect("404");
            return;
        }

        const result = await OrderService.getOrdersByStoreId(storeId);
        res.status(result.code);

        if (result.error) {
            res.redirect("404");
            return;
        }

        res.locals.orders = result.data;
        res.render("orders");
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.send({ error: "Something went wrong!" });
    }
}
