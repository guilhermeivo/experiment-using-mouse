import IQuery from "../../../../common/IQuery";
import Response from "../../../../common/Response";
import Maze from "../../../../entities/Maze";

export interface GetMazeQuery {
    id: string
}

export abstract class GetMazeQueryHadler {
    public static response(request: GetMazeQuery) {
        try {
            // TODO: database search
            return new Response<Array<Maze>>('Sucess', [
                {
                    id: request.id,
                    ipAdress: 'localhost',
                    stringMaze: ''
                }
            ])
        } catch {
            return new Response<Array<Maze>>('Error')
        }
    }
}