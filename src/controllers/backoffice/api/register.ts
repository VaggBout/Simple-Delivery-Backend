import { Request, Response } from "express";
import { IUser } from "../../../types/models";
import * as UserService from "../../../services/user";
import logger from "../../../utils/logger";
import { validationResult } from "express-validator";

export async function post(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send({ error: errors.array()[0].msg });
        return;
    }

    const userData: IUser = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        type: "OWNER",
    };

    try {
        const result = await UserService.register(userData, req.body.password);
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
