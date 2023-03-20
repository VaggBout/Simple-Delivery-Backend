import { DateTime } from "luxon";
import { Types } from "mongoose";
import Order from "../models/order";
import Product from "../models/product";
import { OperationResult } from "../types/common";
import { IProduct, IUser, ProductOrder } from "../types/models";
import * as CategoryService from "./category";

export async function create(
    user: IUser,
    products: Array<ProductOrder>,
    storeId: Types.ObjectId
): Promise<OperationResult<Types.ObjectId>> {
    const productsResult = await CategoryService.getProductsByStoreId(storeId);
    if (productsResult.error || !productsResult.data) {
        return { error: productsResult.error, code: productsResult.code };
    }

    const order = new Order({ user, date: DateTime.now(), store: storeId });
    let totalPrice = 0;

    const menu: Map<String, IProduct> = new Map(
        productsResult.data.map((product) => [product._id.toString(), product])
    );

    for (const product of products) {
        const menuItem = menu.get(product._id);
        if (!menuItem) {
            return {
                error: `Product ${product._id} does not exist on store ${storeId}`,
                code: 400,
            };
        }

        totalPrice += menuItem.price * product.quantity;
        order.products.push(
            new Product({
                name: menuItem.name,
                price: menuItem.price,
                description: menuItem.description,
            })
        );
    }

    order.totalPrice = totalPrice;
    const doc = await order.save();
    return {
        data: doc.id,
        code: 200,
    };
}
