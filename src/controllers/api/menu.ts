import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import * as CategoryService from "../../services/category";
import logger from "../../utils/logger";

export async function get(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({ error: errors.array()[0].msg });
        return;
    }

    const storeId = req.params.id as unknown as Types.ObjectId;
    try {
        const result = await CategoryService.getStoresCategories(storeId);
        res.status(result.code).send(result.data ?? []);
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.send({ error: "Something went wrong!" });
    }
}
