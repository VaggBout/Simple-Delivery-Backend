import { parentPort } from "worker_threads";
import * as CurrencyService from "../services/currency";
import logger from "../utils/logger";

(async function updateCurrencies() {
    try {
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
