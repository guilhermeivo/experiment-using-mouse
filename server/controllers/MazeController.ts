import IQuery from "../common/IQuery";
import Response from "../common/Response";
import Maze from "../entities/Maze";
import { GetMazeQuery, GetMazeQueryHadler } from "../services/Maze/queries/GetMaze/GetMazeQuery";

export default class MazeController {
    Get(request: GetMazeQuery): Response<Array<Maze>> {
        const response = GetMazeQueryHadler.response(request)

        if (response.Succeeded) {
            return response
        }

        return response
    }
}