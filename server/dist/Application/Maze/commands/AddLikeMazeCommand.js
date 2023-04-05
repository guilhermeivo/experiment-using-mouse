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
exports.AddLikeMazeCommandHandler = void 0;
const Response_1 = __importDefault(require("@Application/Common/Models/Response"));
const connection_1 = require("@Infrastructure/Persistence/connection");
class AddLikeMazeCommandHandler {
    static handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.id)
                    throw new Error('Need id to add.');
                const resultGet = yield new Promise((resolve, reject) => {
                    const sql = `select * from mazes
                    where mazes.id = '${request.id}'`;
                    connection_1._context.serialize(() => {
                        return connection_1._context.get(sql, (error, row) => {
                            if (error) {
                                console.error(error.message);
                                return reject(error.message);
                            }
                            return resolve(row);
                        });
                    });
                });
                const resultUpdate = yield new Promise((resolve, reject) => {
                    const sql = `update mazes
                    set likes = '${resultGet.likes + 1}'
                        where mazes.id = '${request.id}'`;
                    connection_1._context.serialize(() => {
                        return connection_1._context.run(sql, function (error) {
                            if (error) {
                                console.error(error.message);
                                return reject(error.message);
                            }
                            return resolve(this.lastID.toString());
                        });
                    });
                });
                return new Response_1.default('Successfully added.', resultUpdate);
            }
            catch (exception) {
                return new Response_1.default(exception.message);
            }
        });
    }
}
exports.AddLikeMazeCommandHandler = AddLikeMazeCommandHandler;
//# sourceMappingURL=AddLikeMazeCommand.js.map