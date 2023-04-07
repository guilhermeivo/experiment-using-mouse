import Response from '@Application/Common/Models/Response'
import { Maze } from '@Infrastructure/Persistence/Connection'
import MazeEntity from '@Domain/Entities/Maze'

export interface GetAllMazeQuery { }

export abstract class GetAllMazeQueryHadler {
    public static async handle(request: GetAllMazeQuery) {
        try {
            const result: Array<MazeEntity> = await Maze.Find()

            if (!result) return new Response<Array<MazeEntity>>('Could not find a maze.')
            return new Response<Array<MazeEntity>>('Found mazes.', result)
        } catch (exception: any) {
            return new Response<Array<MazeEntity>>(exception.message)
        }
    }
}