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
exports.GetByIdMazeQueryHadler = void 0;
const Response_1 = __importDefault(require("@Application/Common/Models/Response"));
const Connection_1 = require("@Infrastructure/Persistence/Connection");
class GetByIdMazeQueryHadler {
    static handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.id)
                    throw new Error('Need id maze to search.');
                const result = yield Connection_1.Maze.Where((x) => x.id == request.id);
                if (!result.length)
                    return new Response_1.default('Could not find a maze with that value.');
                return new Response_1.default('Found maze with that value.', result);
            }
            catch (exception) {
                return new Response_1.default(exception.message);
            }
        });
    }
}
exports.GetByIdMazeQueryHadler = GetByIdMazeQueryHadler;
//# sourceMappingURL=GetByIdMazeQuery.js.map