import mongoose from "mongoose";
import { ICategory } from "../types/models";
import { ProductSchema } from "./product";

const Schema = mongoose.Schema;

const CategorySchema = new Schema<ICategory>({
    name: { type: Schema.Types.String, required: true },
    products: {
        type: [ProductSchema],
        required: true,
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
});

const Category = mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
