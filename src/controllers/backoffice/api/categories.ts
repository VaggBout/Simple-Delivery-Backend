import { Request, Response } from "express";
import { ICategory } from "../../../types/models";
import * as CategoryService from "../../../services/category";
import logger from "../../../utils/logger";
import { validationResult } from "express-validator";

export async function post(req: Request, res: Response): Promise<void> {
    if (!res.locals.user) {
        res.status(401).send();
        return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send({ error: errors.array() });
        return;
    }

    const data: ICategory = {
        name: req.body.name,
        store: req.body.store,
        products: req.body.products,
    };

    try {
        const result = await CategoryService.create(data);
        res.status(result.code);

        if (result.error) {
            res.send({ error: result.error });
            return;
        }

        res.send({ data: result.data });
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.send({ error: "Something went wrong!" });
    }
}
