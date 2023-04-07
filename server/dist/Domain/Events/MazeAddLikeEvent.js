"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function MazeAddLikeEvent(maze) {
    let _maze = Object.assign({}, maze);
    if (_maze.likes)
        _maze.likes += 1;
    else
        _maze.likes = 1;
    return _maze;
}
exports.default = MazeAddLikeEvent;
//# sourceMappingURL=MazeAddLikeEvent.js.map