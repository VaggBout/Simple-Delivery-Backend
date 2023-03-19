import { Request, Response } from "express";
import * as StoreService from "../../services/store";
import logger from "../../utils/logger";

export async function get(_req: Request, res: Response): Promise<void> {
    try {
        const result = await StoreService.getLiveStores();
        res.status(result.code).send(result.data ?? []);
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.send({ error: "Something went wrong!" });
    }
}
