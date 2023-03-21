import axios from "axios";
import mongoose from "mongoose";
import Currency from "../models/currency";
import config from "../utils/config";
import logger from "../utils/logger";

const fixerUrl = "https://api.apilayer.com/fixer";

type CurrencyResponse = { [key: string]: number };

export async function upsertCurrencies() {
    logger.debug("Updating currencies");
    const apiKey = config.fixerApiKey;

    const response = await axios.get(`${fixerUrl}/latest`, {
        params: {
            base: "EUR",
        },
        headers: {
            apiKey,
        },
    });

    if (!response.data.success) {
        throw new Error("Failed to retrieve currencies");
    }
    const rates: CurrencyResponse = response.data.rates;

    const update = Object.entries(rates).map((e) => ({
        updateOne: {
            filter: { symbol: e[0] },
            update: {
                $set: {
                    symbol: e[0],
                    rate: mongoose.Types.Decimal128.fromString(e[1].toString()),
                },
            },
            upsert: true,
        },
    }));

    await Currency.bulkWrite([...update]);
    logger.debug("Finished updating currencies");
}
