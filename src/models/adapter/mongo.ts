import mongoose from "mongoose";
import config from "../../utils/config";

let _db: MongoAdapter | null = null;

class MongoAdapter {
    private _connection: mongoose.Connection;

    constructor(databaseUrl: string) {
        this._connection = mongoose.createConnection(databaseUrl);
    }

    get connection() {
        return this._connection;
    }

    public async close() {
        await this._connection.close();
    }
}

export function init() {
    if (_db) {
        throw new Error("DB already initialized once!");
    }

    _db = new MongoAdapter(config.databaseUrl);
}

export default function mongo() {
    if (_db) {
        return _db.connection;
    }

    throw new Error("DB connection is not yet initialized!");
}
