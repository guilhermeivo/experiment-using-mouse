"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function MazeAddViewEvent(maze) {
    let _maze = Object.assign({}, maze);
    if (_maze.views)
        _maze.views += 1;
    else
        _maze.views = 1;
    return _maze;
}
exports.default = MazeAddViewEvent;
//# sourceMappingURL=MazeAddViewEvent.js.map