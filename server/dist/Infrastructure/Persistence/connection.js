"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.openConnection = void 0;
const sqlite3_1 = require("sqlite3");
require('dotenv').config();
const sqlite3 = (0, sqlite3_1.verbose)();
const databaseUrl = process.env.DATABASE_URL || '';
function openConnection() {
    const contextDb = new sqlite3.Database(databaseUrl, (error) => {
        if (error) {
            return console.error(error.message);
        }
    });
    return contextDb;
}
exports.openConnection = openConnection;
function closeConnection(contextDb) {
    contextDb.close((error) => {
        if (error) {
            return console.error(error.message);
        }
    });
}
exports.closeConnection = closeConnection;
//# sourceMappingURL=connection.js.map