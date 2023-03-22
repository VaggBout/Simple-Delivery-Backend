import mongoose from "mongoose";
import { IStore } from "../types/models";

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
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Store = mongoose.model<IStore>("Store", StoreSchema);
export default Store;
