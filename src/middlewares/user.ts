import { Request, Response, NextFunction } from "express";
import * as UserService from "../services/user";
import logger from "../utils/logger";

/**
 * Middleware responsible for populating
 * user object to `res` in case user is already logged in
 */
export async function populateAuthUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token: string | null = req.cookies.token;
    if (!token) {
        return next();
    }

    const validatedToken = UserService.validateToken(token);
    if (!validatedToken) {
        return next();
    }

    try {
        const result = await UserService.getUserById(validatedToken.id);

        if (result.data) {
            res.locals.user = result.data;
        }
    } catch (error) {
        logger.error(`Error populating user in middleware ${error}`);
    } finally {
        next();
    }
}
