import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import * as CategoryService from "../../services/category";
import logger from "../../utils/logger";

export async function get(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({ error: errors.array() });
        return;
    }

    const storeId = req.params.id as unknown as Types.ObjectId;
    const currencyCode = req.query?.currency
        ? (req.query?.currency as unknown as string)
        : null;

    try {
        const result = await CategoryService.getStoresCategories(
            storeId,
            currencyCode
        );

        res.status(result.code);
        if (result.error) {
            if (result.error) {
                res.send({ error: result.error });
                return;
            }
        }
        res.send(result.data ?? []);
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.send({ error: "Something went wrong!" });
    }
}
