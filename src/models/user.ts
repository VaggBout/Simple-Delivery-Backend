import mongoose from "mongoose";
import { IUser } from "../types/models";
import mongo from "./adapter/mongo";

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    address: Schema.Types.Number,
});

const User = mongo().model<IUser>("User", UserSchema);
export default User;
