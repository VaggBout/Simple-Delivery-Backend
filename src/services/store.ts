import { STATES, Types } from "mongoose";
import Category from "../models/category";
import Store from "../models/store";
import User from "../models/user";
import { OperationResult } from "../types/common";
import { IStore } from "../types/models";
import logger from "../utils/logger";

export async function create(
    data: IStore
): Promise<OperationResult<Types.ObjectId>> {
    const existingStore = await Store.findOne({ name: data.name });
    if (existingStore) {
        return {
            error: `Store with name ${data.name} already exists`,
            code: 400,
        };
    }

    const owner = await User.findById(data.owner);
    if (!owner) {
        logger.warn(`User ${data.owner} does not exist`);
        return {
            error: "Invalid user",
            code: 400,
        };
    }

    const store = new Store({ ...data });
    const doc = await store.save();

    if (!doc._id) {
        return {
            error: "Failed to create store",
            code: 500,
        };
    }

    return {
        data: doc._id,
        code: 200,
    };
}

export async function publish(
    storeId: Types.ObjectId
): Promise<OperationResult<Types.ObjectId>> {
    const store = await Store.findById(storeId);
    if (!store) {
        return {
            error: `Store ${storeId} does not exist`,
            code: 404,
        };
    }

    if (store.status === "LIVE") {
        return {
            error: `Store ${storeId} is already live`,
            code: 400,
        };
    }

    const menu = await Category.find({ store: storeId });
    if (menu.length < 3) {
        return {
            error: "Store needs at least 3 categories before publishing",
            code: 400,
        };
    }

    const update = { status: "LIVE" };
    await store.updateOne(update);

    return {
        data: storeId,
        code: 200,
    };
}
