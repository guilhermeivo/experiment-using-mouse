import Maze from "@Domain/Entities/Maze";

export default function MazeAddViewEvent(maze: Maze): Maze {
    let _maze = { ...maze }
    if (_maze.views) _maze.views += 1
    else _maze.views = 1

    return _maze
}