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
const Response_1 = __importDefault(require("@Application/Common/Models/Response"));
const Connection_1 = require("@Infrastructure/Persistence/Connection");
class CreateMazeCommandHandler {
    static handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.name || !request.encodedString || !request.sessionId)
                    throw new Error('Missing values.');
                const result = [...yield Connection_1.Session.Where((x) => x.token === request.sessionId)][0];
                if (result.id) {
                    let entity = {
                        name: request.name,
                        sessionId: result.id,
                        description: request.description,
                        encodedString: request.encodedString
                    };
                    const mazeId = yield Connection_1.Maze.Add(entity);
                    return new Response_1.default('Created maze.', mazeId);
                }
                else {
                    throw new Error('Session invalid.');
                }
            }
            catch (exception) {
                return new Response_1.default(exception.message);
            }
        });
    }
}
exports.CreateMazeCommandHandler = CreateMazeCommandHandler;
//# sourceMappingURL=CreateMazeCommand.js.map