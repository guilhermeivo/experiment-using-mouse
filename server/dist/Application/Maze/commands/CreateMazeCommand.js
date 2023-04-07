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
                if (!request.sessionId)
                    throw new Error('Session invalid.');
                if (!request.name || !request.encodedString)
                    throw new Error('Missing values.');
                let entity = {
                    name: request.name,
                    sessionId: request.sessionId,
                    description: request.description,
                    encodedString: request.encodedString,
                    createdOn: new Date().toISOString()
                };
                const mazeId = yield Connection_1.Maze.Add(entity);
                return new Response_1.default('Maze successfully created.', mazeId);
            }
            catch (exception) {
                return new Response_1.default(exception.message);
            }
        });
    }
}
exports.CreateMazeCommandHandler = CreateMazeCommandHandler;
//# sourceMappingURL=CreateMazeCommand.js.map