import Response from '@Application/Common/Models/Response'
import { Maze } from '@Infrastructure/Persistence/Connection'
import MazeEntity from '@Domain/Entities/Maze'

export interface GetByIdMazeQuery {
    id: string
}

export abstract class GetByIdMazeQueryHadler {
    public static async handle(request: GetByIdMazeQuery) {
        try {
            if (!request.id) throw new Error('Need id maze to search.')

            const result: Array<MazeEntity> = await Maze.Where((x: MazeEntity) => x.id == request.id)
            
            if (!result.length) return new Response<Array<MazeEntity>>('Could not find a maze with that value.')
            return new Response<Array<MazeEntity>>('Found maze with that value.', result)
        } catch (exception: any) {
            return new Response<Array<MazeEntity>>(exception.message)
        }
    }
}