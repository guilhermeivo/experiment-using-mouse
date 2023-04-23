import Response from '@Application/Common/Models/Response'
import { Interaction, Maze } from '@Infrastructure/Persistence/connection'
import MazeEntity from '@Domain/Entities/Maze'
import InteractionEntity from '@Domain/Entities/Interaction'
import MazeDto from '@Application/Maze/queries/MazeDto'
import EnumTypeInteractions from '@Domain/Enumerations/EnumTypeInteractions'

export interface GetByIdMazeQuery {
    id: string
    sessionId: string
}

export abstract class GetByIdMazeQueryHadler {
    public static async handle(request: GetByIdMazeQuery): Promise<Response<Array<MazeDto>>> {
        try {
            if (!request.sessionId) throw new Error('Session invalid.')
            if (!request.id) throw new Error('Need id maze to search.')

            const listMaze: Array<MazeEntity> = await Maze.Where((x: MazeEntity) => x.id == request.id)

            const result: Array<MazeDto> = []

            await Promise.all(
                listMaze.map(async (maze: MazeEntity) => {
                    const amountLikes = await Interaction.Count((x: InteractionEntity) => x.mazeId == maze.id && x.type == EnumTypeInteractions.Liked.toString())
                    const amountViews = await Interaction.Count((x: InteractionEntity) => x.mazeId == maze.id && x.type == EnumTypeInteractions.Visualized.toString())
                    const isLiked = await Interaction.Where((x: InteractionEntity) => x.mazeId == maze.id && x.sessionId == request.sessionId && x.type == EnumTypeInteractions.Liked.toString())

                    const entity: MazeDto = {
                        id: maze.id,
                        name: maze.name,
                        description: maze.description,
                        like: amountLikes,
                        view: amountViews,
                        isLiked: isLiked.length ? true : false,
                        createdOn: maze.createdOn,
                        encodedString: maze.encodedString
                    }
    
                    result.push(entity)
                }))
            
            if (!result.length) return new Response<Array<MazeDto>>('Could not find a maze with that value.')
            return new Response<Array<MazeDto>>('Found maze with that value.', result)
        } catch (exception: any) {
            return new Response<Array<MazeDto>>(exception.message)
        }
    }
}