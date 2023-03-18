import mongoose from "mongoose";
import { ICategory } from "../types/models";
import mongo from "./adapter/mongo";
import Product from "./product";

const Schema = mongoose.Schema;

const CategorySchema = new Schema<ICategory>({
    name: { type: Schema.Types.String, required: true },
    products: {
        type: [Product],
        required: true,
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
});

const Category = mongo().model<ICategory>("Category", CategorySchema);
export default Category;
