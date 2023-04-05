"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.openConnection = exports._context = void 0;
const sqlite3_1 = require("sqlite3");
require('dotenv').config();
const sqlite3 = (0, sqlite3_1.verbose)();
const databaseUrl = process.env.DATABASE_URL || '';
function openConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports._context)
            return;
        const contextDb = new sqlite3.Database(databaseUrl, (error) => {
            if (error) {
                return console.error(error.message);
            }
            console.log('Connected to the SQlite database.');
        });
        exports._context = contextDb;
    });
}
exports.openConnection = openConnection;
function closeConnection() {
    exports._context.close((error) => {
        if (error) {
            return console.error(error.message);
        }
        console.log('Close the database connection.');
    });
}
exports.closeConnection = closeConnection;
//# sourceMappingURL=connection.js.map