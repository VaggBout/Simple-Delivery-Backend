import Bree from "bree";
import path from "path";
import logger from "../utils/logger";

export function registerJobs() {
    const bree = new Bree({
        logger,
        root: false,
        jobs: [
            {
                name: "Update Currencies - Cron",
                path: path.join(__dirname, "currencyJob.js"),
                // runs job every one hour
                cron: "0 * * * *",
            },
            {
                // Runs job on boot
                name: "Update Currencies - Boot",
                path: path.join(__dirname, "currencyJob.js"),
            },
        ],
    });

    bree.start();
}
