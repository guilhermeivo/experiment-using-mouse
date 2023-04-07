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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.openConnection = exports.Session = exports.Maze = exports._context = void 0;
const sqlite3_1 = require("sqlite3");
const DBSet_1 = __importDefault(require("@Infrastructure/Persistence/DBSet"));
require('dotenv').config();
const sqlite3 = (0, sqlite3_1.verbose)();
const databaseUrl = process.env.DATABASE_URL || '';
exports.Maze = (0, DBSet_1.default)('mazes');
exports.Session = (0, DBSet_1.default)('session');
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
//# sourceMappingURL=Connection.js.map