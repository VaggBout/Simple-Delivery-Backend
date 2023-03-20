import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import { IUser, ProductOrder } from "../../types/models";
import * as OrderService from "../../services/order";
import logger from "../../utils/logger";

export async function post(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({ error: errors.array()[0].msg });
        return;
    }

    const storeId = req.params.id as unknown as Types.ObjectId;
    const user: IUser = req.body.user;
    const products: Array<ProductOrder> = req.body.products;

    user.type = "GUEST";

    try {
        const result = await OrderService.create(user, products, storeId);
        res.status(result.code);
        if (result.error) {
            res.send({ error: result.error });
            return;
        }

        res.send({ data: result.data });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.send({ error: "Something went wrong!" });
    }
}
