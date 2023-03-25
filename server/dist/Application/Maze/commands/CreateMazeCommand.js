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
exports.CreateMazeCommandHandler = void 0;
const Response_1 = __importDefault(require("@Application/Common/Response"));
const connection_1 = require("@Infrastructure/Persistence/connection");
class CreateMazeCommandHandler {
    static handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.name || !request.ipAdress || !request.encodedString)
                    throw new Error('missing values');
                const result = yield new Promise((resolve, reject) => {
                    const sql = `insert into mazes (name, description, ipAdress, encodedString)
                values ('${request.name}', '${request.description}', '${request.ipAdress}', '${request.encodedString}')`;
                    return connection_1._context.run(sql, function (error) {
                        if (error) {
                            console.error(error.message);
                            return reject(error.message);
                        }
                        return resolve(this.lastID.toString());
                    });
                });
                return new Response_1.default('sucess created', result);
            }
            catch (exception) {
                return new Response_1.default(exception.message);
            }
        });
    }
}
exports.CreateMazeCommandHandler = CreateMazeCommandHandler;
//# sourceMappingURL=CreateMazeCommand.js.map