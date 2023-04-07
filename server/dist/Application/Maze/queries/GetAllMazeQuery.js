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
const Response_1 = __importDefault(require("@Application/Common/Models/Response"));
const Connection_1 = require("@Infrastructure/Persistence/Connection");
const EnumTypeInteractions_1 = __importDefault(require("@Domain/Enumerations/EnumTypeInteractions"));
class GetAllMazeQueryHadler {
    static handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.sessionId)
                    throw new Error('Session invalid.');
                const listMaze = yield Connection_1.Maze.Find();
                const result = [];
                yield Promise.all(listMaze.map((maze) => __awaiter(this, void 0, void 0, function* () {
                    const amountLikes = yield Connection_1.Interaction.Count((x) => x.mazeId == maze.id && x.type == EnumTypeInteractions_1.default.Liked.toString());
                    const amountViews = yield Connection_1.Interaction.Count((x) => x.mazeId == maze.id && x.type == EnumTypeInteractions_1.default.Visualized.toString());
                    const isLiked = yield Connection_1.Interaction.Where((x) => x.mazeId == maze.id && x.sessionId == request.sessionId && x.type == EnumTypeInteractions_1.default.Liked.toString());
                    const entity = {
                        id: maze.id,
                        name: maze.name,
                        description: maze.description,
                        like: amountLikes,
                        view: amountViews,
                        isLiked: isLiked.length ? true : false,
                        createdOn: maze.createdOn,
                        encodedString: maze.encodedString
                    };
                    result.push(entity);
                })));
                if (!result)
                    return new Response_1.default('Could not find a maze.');
                return new Response_1.default('Found mazes.', result);
            }
            catch (exception) {
                return new Response_1.default(exception.message);
            }
        });
    }
}
exports.GetAllMazeQueryHadler = GetAllMazeQueryHadler;
//# sourceMappingURL=GetAllMazeQuery.js.map