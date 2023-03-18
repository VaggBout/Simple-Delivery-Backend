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

export default function mongo() {
    if (_db) {
        return _db.connection;
    }

    _db = new MongoAdapter(config.databaseUrl);
    return _db.connection;
}
