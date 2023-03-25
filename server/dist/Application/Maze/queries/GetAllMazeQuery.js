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
exports.GetAllMazeQueryHadler = void 0;
const Response_1 = __importDefault(require("@Application/Common/Response"));
const connection_1 = require("@Infrastructure/Persistence/connection");
class GetAllMazeQueryHadler {
    static handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const context = (0, connection_1.openConnection)();
                const result = yield new Promise((resolve, reject) => {
                    const sql = `select * from mazes`;
                    return context.all(sql, (error, rows) => {
                        if (error) {
                            console.error(error.message);
                            return reject(error.message);
                        }
                        return resolve(rows);
                    });
                });
                (0, connection_1.closeConnection)(context);
                return new Response_1.default('sucess search', result);
            }
            catch (exception) {
                return new Response_1.default(exception.message);
            }
        });
    }
}
exports.GetAllMazeQueryHadler = GetAllMazeQueryHadler;
//# sourceMappingURL=GetAllMazeQuery.js.map