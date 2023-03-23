import { CookieOptions, Request, Response } from "express";
import { UserDao } from "../../../types/models";
import * as UserService from "../../../services/user";
import * as StoreService from "../../../services/store";
import logger from "../../../utils/logger";
import { validationResult } from "express-validator";

export async function post(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send({ error: errors.array()[0].msg });
        return;
    }

    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
        const result = await UserService.auth(email, password);
        res.status(result.code);

        if (result.error || !result.data) {
            res.send({ error: result.error ?? "Invalid credentials" });
            return;
        }

        const token = UserService.generateAuthToken(result.data as UserDao);

        const options: CookieOptions = {
            expires: new Date(Date.now() + 3600000 * 24 * 60),
        };
        res.cookie("token", token, options);

        const storeResult = await StoreService.getStoreByOwnerId(
            result.data?._id
        );
        res.send({ data: storeResult.data });
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.send({ error: "Something went wrong!" });
    }
}
