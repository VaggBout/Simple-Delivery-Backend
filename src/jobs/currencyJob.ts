import mongoose from "mongoose";
import { parentPort } from "worker_threads";
import * as CurrencyService from "../services/currency";
import config from "../utils/config";
import logger from "../utils/logger";

(async function updateCurrencies() {
    try {
        mongoose.connect(config.databaseUrl);
        await CurrencyService.upsertCurrencies();
    } catch (error) {
        logger.error(`Failed to update latest currency rates. Error: ${error}`);
    }

    if (parentPort) {
        parentPort.postMessage("done");
    } else {
        process.exit(0);
    }
})();
