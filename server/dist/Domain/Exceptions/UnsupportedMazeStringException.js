"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnsupportedMazeStringException = (message) => ({
    error: new Error(message),
    code: 'UNSUPPOTERD_MAZE_STRING_EXCEPTION'
});
UnsupportedMazeStringException.prototype = Error.prototype;
exports.default = UnsupportedMazeStringException;
//# sourceMappingURL=UnsupportedMazeStringException.js.map