import User from "../models/user";
import { IUser } from "../types/models";
import * as bcrypt from "bcrypt";
import logger from "../utils/logger";
import { OperationResult } from "../types/common";
import jwt from "jsonwebtoken";
import config from "../utils/config";
import { JwtToken } from "../types/auth";
import { Types } from "mongoose";

const saltRounds = 10;

export async function register(
    data: IUser,
    password: string | null
): Promise<OperationResult<Types.ObjectId>> {
    data.email = data.email.trim();
    data.name = data.name.trim();

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        return {
            error: `User with email ${data.email} already exists`,
            code: 400,
        };
    }

    if (data.type === "OWNER") {
        if (!password) {
            return {
                error: "Password is mandatory",
                code: 400,
            };
        }
        data.hash = await generateHash(password);
    }

    const user = await new User({ ...data }).save();

    return {
        data: user._id,
        code: 200,
    };
}

export async function auth(
    email: string,
    password: string
): Promise<OperationResult<IUser>> {
    const user = await User.findOne({ email: email });

    if (!user) {
        logger.warn(`User ${email} does not exist`);
        return {
            error: "Invalid credentials",
            code: 400,
        };
    }

    if (user.type === "GUEST" || !user.hash) {
        logger.warn(`User ${email} is guest or has no password defined`);
        return {
            error: "Invalid credentials",
            code: 400,
        };
    }

    const hasValidCreds = await bcrypt.compare(password, user.hash);
    if (!hasValidCreds) {
        logger.warn(`Invalid credentials for user ${email}`);
        return {
            error: "Invalid credentials",
            code: 400,
        };
    }

    return { data: user, code: 200 };
}

export function generateAuthToken(user: IUser): string {
    const token = jwt.sign(
        {
            email: user.email,
            name: user.name,
        },
        config.tokenSecret,
        { expiresIn: "30d" }
    );

    return token;
}

async function generateHash(s: string): Promise<string> {
    try {
        const hash = await bcrypt.hash(s, saltRounds);
        return hash;
    } catch (error) {
        throw new Error(`Error hashing ${s}. Error: ${JSON.stringify(error)}`);
    }
}

export function validateToken(token: string): JwtToken | null {
    try {
        const tokenData = jwt.verify(token, config.tokenSecret, {
            ignoreExpiration: false,
        }) as JwtToken;

        return tokenData;
    } catch (error) {
        logger.warn(`Failed to verify token: ${token}`);
        return null;
    }
}
