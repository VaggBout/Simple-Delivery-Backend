import mongoose from "mongoose";
import { IUser } from "../types/models";
import mongo from "./adapter/mongo";

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    address: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
    },
    type: {
        type: Schema.Types.String,
        enum: ["GUEST", "OWNER"],
        required: true,
    },
    hash: {
        type: Schema.Types.String,
        required: false,
    },
});

const User = mongo().model<IUser>("User", UserSchema);
export default User;
