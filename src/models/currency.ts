import mongoose from "mongoose";
import { ICurrency } from "../types/models";
import mongo from "./adapter/mongo";

const Schema = mongoose.Schema;

export const CurrencySchema = new Schema<ICurrency>({
    symbol: {
        type: Schema.Types.String,
        required: true,
    },
    rate: {
        type: Schema.Types.Decimal128,
        required: true,
    },
});

CurrencySchema.index({ symbol: 1 }, { unique: true });
const Currency = mongo().model<ICurrency>("Currency", CurrencySchema);

export default Currency;
