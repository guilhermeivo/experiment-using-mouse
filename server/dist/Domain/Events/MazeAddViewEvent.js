"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EnumTypeInteractions_1 = __importDefault(require("@Domain/Enumerations/EnumTypeInteractions"));
function MazeAddViewEvent(ids) {
    const { sessionId, mazeId } = ids;
    const interaction = {
        sessionId: sessionId,
        mazeId: mazeId,
        type: EnumTypeInteractions_1.default.Visualized.toString()
    };
    return interaction;
}
exports.default = MazeAddViewEvent;
//# sourceMappingURL=MazeAddViewEvent.js.map