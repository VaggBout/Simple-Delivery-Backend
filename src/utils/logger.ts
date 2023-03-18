import winston from "winston";
import config from "./config";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const level = () => {
    const env = config.nodeEnv;
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "cyan",
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

const transports = [new winston.transports.Console()];

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

export = logger;
