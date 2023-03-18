import { Request, Response } from "express";
import { IUser } from "../../../types/models";
import * as UserService from "../../../services/user";
import logger from "../../../utils/logger";

export async function post(req: Request, res: Response): Promise<void> {
    const userData: IUser = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        type: "OWNER",
    };

    try {
        const result = await UserService.register(userData, req.body.password);
        res.statusCode = result.code;

        if (result.error) {
            res.send({ error: result.error });
            return;
        }

        res.send({ data: result.data });
    } catch (error) {
        logger.error(error);
        res.statusCode = 500;
        res.send({ error: "Something went wrong!" });
    }
}
