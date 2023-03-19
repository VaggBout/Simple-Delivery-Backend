import mongoose from "mongoose";
import { IProduct } from "../types/models";
import mongo from "./adapter/mongo";

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
});

const Product = mongo().model<IProduct>("Product", ProductSchema);
export default Product;
