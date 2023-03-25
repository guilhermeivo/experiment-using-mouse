"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.openConnection = void 0;
const _01_create_mazes_1 = __importDefault(require("@Infrastructure/Persistence/migrations/01_create_mazes"));
const sqlite3_1 = require("sqlite3");
require('dotenv').config();
const sqlite3 = (0, sqlite3_1.verbose)();
const databaseUrl = process.env.DATABASE_URL || '';
function openConnection() {
    const contextDb = new sqlite3.Database(databaseUrl, (error) => {
        if (error) {
            return console.error(error.message);
        }
        (0, _01_create_mazes_1.default)();
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