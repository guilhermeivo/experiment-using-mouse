import Maze from "@Domain/Entities/Maze";

export default function MazeAddLikeEvent(maze: Maze): Maze {
    let _maze = { ...maze }
    if (_maze.likes) _maze.likes += 1
    else _maze.likes = 1

    return _maze
}