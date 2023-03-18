import mongoose from "mongoose";
import { IOrder } from "../types/models";
import mongo from "./adapter/mongo";
import Product from "./product";
import User from "./user";

const Schema = mongoose.Schema;

const OrderSchema = new Schema<IOrder>({
    user: {
        type: User,
        required: true,
    },
    products: {
        type: [Product],
        required: true,
    },
    date: {
        type: Schema.Types.Date,
        required: true,
    },
    totalPrice: {
        type: Schema.Types.Number,
        required: true,
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
});

const Order = mongo().model<IOrder>("Order", OrderSchema);
export default Order;
