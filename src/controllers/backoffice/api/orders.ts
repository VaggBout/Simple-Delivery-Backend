import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import * as OrderService from "../../../services/order";
import * as StoreService from "../../../services/store";
import logger from "../../../utils/logger";

// TODO: Consider pagination + replace pooling with websocket
export async function get(req: Request, res: Response): Promise<void> {
    if (!res.locals.user) {
        res.status(401).send();
        return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send({ error: errors.array() });
        return;
    }

    const storeId = req.params.id as unknown as Types.ObjectId;
    try {
        const storeResult = await StoreService.getStoreByOwnerId(
            res.locals.user.id
        );

        if (storeResult.error) {
            res.status(storeResult.code).send({ error: storeResult.error });
            return;
        }

        const result = await OrderService.getOrdersByStoreId(storeId);
        res.status(result.code);

        if (result.error) {
            res.status(result.code).send({ error: result.error });
            return;
        }

        const html: string = await new Promise(function (resolve, reject) {
            req.app.render(
                "partials/ordersList",
                {
                    user: res.locals.user,
                    orders: result.data ?? [],
                },
                function (error: Error, html: string) {
                    if (error) {
                        return reject(error);
                    }
                    resolve(html);
                }
            );
        });

        res.send({ html });
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.send({ error: "Something went wrong!" });
    }
}
