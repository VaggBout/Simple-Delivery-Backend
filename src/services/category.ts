import mongoose, { Types } from "mongoose";
import Category from "../models/category";
import Currency from "../models/currency";
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
    storeId: Types.ObjectId,
    currencySymbol: string | null
): Promise<OperationResult<Array<CategoryDao>>> {
    const store = await Store.findById(storeId);

    if (!store || store.status === "DRAFT") {
        return {
            error: `Store ${storeId} does not exist`,
            code: 404,
        };
    }

    let menu: Array<CategoryDao>;
    if (currencySymbol) {
        const currency = await Currency.findOne({ symbol: currencySymbol });
        if (!currency) {
            return {
                error: `Unsupported currency: ${currencySymbol}`,
                code: 400,
            };
        }

        menu = await getStoresCategoriesForCurrency(storeId, currency.rate);
    } else {
        menu = await getStoresCategoriesDefaultPrice(storeId);
    }

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

async function getStoresCategoriesDefaultPrice(
    storeId: mongoose.Types.ObjectId
): Promise<Array<CategoryDao>> {
    const menu: Array<CategoryDao> = await Category.find(
        { store: storeId },
        { name: 1, products: 1, _id: 1 }
    );

    return menu;
}

async function getStoresCategoriesForCurrency(
    storeId: mongoose.Types.ObjectId,
    rate: Types.Decimal128
): Promise<Array<CategoryDao>> {
    const menu: Array<CategoryDao> = await Category.aggregate([
        {
            $match: {
                $expr: {
                    $eq: ["$store", { $toObjectId: storeId }],
                },
            },
        },
        {
            $project: {
                name: 1,
                _id: 1,
                products: {
                    $map: {
                        input: "$products",
                        as: "product",
                        in: {
                            name: "$$product.name",
                            description: "$$product.description",
                            price: {
                                $toString: {
                                    $round: [
                                        {
                                            $multiply: [
                                                "$$product.price",
                                                rate,
                                            ],
                                        },
                                        2,
                                    ],
                                },
                            },
                            _id: "$$product._id",
                        },
                    },
                },
            },
        },
    ]);

    return menu;
}
