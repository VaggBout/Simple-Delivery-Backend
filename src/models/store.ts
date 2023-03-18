import mongoose from "mongoose";
import { IStore } from "../types/models";
import mongo from "./adapter/mongo";
import User from "./user";

const Schema = mongoose.Schema;

const StoreSchema = new Schema<IStore>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    status: {
        type: Schema.Types.String,
        required: true,
        enum: ["DRAFT", "LIVE"],
    },
    owner: {
        type: User,
        required: true,
    },
});

const Store = mongo().model<IStore>("Store", StoreSchema);
export default Store;
