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
exports.AddViewMazeCommandHandler = void 0;
const Response_1 = __importDefault(require("@Application/Common/Models/Response"));
const Connection_1 = require("@Infrastructure/Persistence/Connection");
const MazeAddViewEvent_1 = __importDefault(require("@Domain/Events/MazeAddViewEvent"));
const EnumTypeInteractions_1 = __importDefault(require("@Domain/Enumerations/EnumTypeInteractions"));
class AddViewMazeCommandHandler {
    static handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.sessionId)
                    throw new Error('Session invalid.');
                if (!request.id)
                    throw new Error('Missing id.');
                var maze = [...yield Connection_1.Maze.Where((x) => x.id == request.id)][0];
                if (maze) {
                    var foundInteractions = yield Connection_1.Interaction.Where((x) => x.mazeId == request.id && x.sessionId == request.sessionId && x.type == EnumTypeInteractions_1.default.Visualized.toString());
                    if (foundInteractions.length > 0)
                        throw new Error('This session has already held a view in this maze.');
                    const interaction = (0, MazeAddViewEvent_1.default)({ sessionId: request.sessionId, mazeId: request.id });
                    yield Connection_1.Interaction.Add(interaction);
                    return new Response_1.default('Successfully added view.', request.id);
                }
                else {
                    throw new Error('Invalid id.');
                }
            }
            catch (exception) {
                return new Response_1.default(exception.message);
            }
        });
    }
}
exports.AddViewMazeCommandHandler = AddViewMazeCommandHandler;
//# sourceMappingURL=AddViewMazeCommand.js.map