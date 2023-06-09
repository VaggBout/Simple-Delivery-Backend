import dotenv from "dotenv";
import joi from "joi";
import path from "path";

const suffix = process.env.ENV ? `.${process.env.ENV}` : "";
dotenv.config({ path: path.join(__dirname, `../../.env${suffix}`) });

const configSchema = joi
    .object()
    .keys({
        NODE_ENV: joi
            .string()
            .valid("production", "development", "test")
            .required(),
        PORT: joi.number().positive().required(),
        DATABASE_URL: joi.string().required(),
        TOKEN_SECRET: joi.string().required(),
        FIXER_API_KEY: joi.string().required(),
    })
    .unknown();

const { value: envConfig, error } = configSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export = {
    nodeEnv: envConfig.NODE_ENV as string,
    port: envConfig.PORT as string,
    databaseUrl: envConfig.DATABASE_URL as string,
    tokenSecret: envConfig.TOKEN_SECRET as string,
    fixerApiKey: envConfig.FIXER_API_KEY as string,
};
