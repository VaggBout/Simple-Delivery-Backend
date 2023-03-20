import mongoose, { Types } from "mongoose";
import Category from "../models/category";
import Store from "../models/store";
import { OperationResult } from "../types/common";
import { CategoryDao, ICategory, IProduct } from "../types/models";

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

export async function getStoresCategories(
    storeId: Types.ObjectId
): Promise<OperationResult<Array<CategoryDao>>> {
    const store = await Store.findById(storeId);

    if (!store || store.status === "DRAFT") {
        return {
            error: `Store ${storeId} does not exist`,
            code: 404,
        };
    }

    const menu = await Category.find(
        { store: storeId },
        { name: 1, products: 1, _id: 1 }
    );
    return {
        data: menu,
        code: 200,
    };
}

export async function getProductsByStoreId(
    storeId: mongoose.Types.ObjectId
): Promise<OperationResult<Array<IProduct>>> {
    const store = await Store.findById(storeId);

    if (!store || store.status === "DRAFT") {
        return {
            error: `Store ${storeId} does not exist`,
            code: 404,
        };
    }
    console.log(storeId);
    const products: Array<IProduct> = await Category.aggregate([
        { $match: { $expr: { $eq: ["$store", { $toObjectId: storeId }] } } },
        { $unwind: "$products" },
        { $replaceRoot: { newRoot: "$products" } },
    ]);

    return {
        data: products ?? [],
        code: 200,
    };
}
