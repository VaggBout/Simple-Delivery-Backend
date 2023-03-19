import { Types } from "mongoose";
import Store from "../models/store";
import User from "../models/user";
import { OperationResult } from "../types/common";
import { IStore } from "../types/models";
import logger from "../utils/logger";

export async function create(
    data: IStore,
    ownerEmail: string
): Promise<OperationResult<Types.ObjectId>> {
    const existingStore = await Store.findOne({ name: data.name });
    if (existingStore) {
        return {
            error: `Store with name ${data.name} already exists`,
            code: 400,
        };
    }

    const owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
        logger.warn(`User ${ownerEmail} does not exist`);
        return {
            error: "Invalid credentials",
            code: 400,
        };
    }

    const store = new Store({ ...data, owner: owner._id });
    const doc = await store.save();

    if (!doc._id) {
        return {
            error: "Invalid credentials",
            code: 400,
        };
    }

    return {
        data: doc._id,
        code: 200,
    };
}
