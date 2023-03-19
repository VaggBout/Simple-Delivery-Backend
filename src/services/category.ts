import { Types } from "mongoose";
import Category from "../models/category";
import Store from "../models/store";
import { OperationResult } from "../types/common";
import { ICategory } from "../types/models";

export async function create(
    data: ICategory
): Promise<OperationResult<Types.ObjectId>> {
    const existingCategory = await Category.findOne({
        $and: [{ name: data.name }, { store: data.store }],
    });

    if (existingCategory) {
        return {
            error: `Category ${data.name} already exists`,
            code: 400,
        };
    }

    const store = await Store.findById(data.store);
    if (!store) {
        return {
            error: `Store with ${data.store} does not exist`,
            code: 404,
        };
    }

    const category = new Category({ ...data });
    const doc = await category.save();

    if (!doc._id) {
        return {
            error: "Failed to create category",
            code: 500,
        };
    }

    return {
        data: doc._id,
        code: 200,
    };
}
