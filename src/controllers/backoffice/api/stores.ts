import { Request, Response } from "express";
import { IStore } from "../../../types/models";
import * as StoreService from "../../../services/store";
import logger from "../../../utils/logger";
import { validationResult } from "express-validator";
import { Types } from "mongoose";

export async function post(req: Request, res: Response): Promise<void> {
    if (!res.locals.user) {
        res.status(401).send();
        return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send({ error: errors.array()[0].msg });
        return;
    }

    const data: IStore = {
        name: req.body.name,
        status: "DRAFT",
        owner: res.locals.user._id,
    };

    try {
        const result = await StoreService.create(data);
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

export async function publish(req: Request, res: Response): Promise<void> {
    if (!res.locals.user) {
        res.status(401).send();
        return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({ error: errors.array()[0].msg });
        return;
    }

    const storeId = req.params.id as unknown as Types.ObjectId;
    try {
        const result = await StoreService.publish(storeId);
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
