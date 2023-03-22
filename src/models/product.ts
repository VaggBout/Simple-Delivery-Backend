import mongoose from "mongoose";
import { IProduct } from "../types/models";

const Schema = mongoose.Schema;

export const ProductSchema = new Schema<IProduct>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    price: {
        type: Schema.Types.Number,
        required: true,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    quantity: {
        type: Schema.Types.Number,
        required: false,
    },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
