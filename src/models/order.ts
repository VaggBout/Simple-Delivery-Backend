import mongoose from "mongoose";
import { IOrder } from "../types/models";
import { ProductSchema } from "./product";
import { UserSchema } from "./user";

const Schema = mongoose.Schema;

const OrderSchema = new Schema<IOrder>({
    user: {
        type: UserSchema,
        required: true,
    },
    products: {
        type: [ProductSchema],
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

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
