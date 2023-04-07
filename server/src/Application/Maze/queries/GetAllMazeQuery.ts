import Response from '@Application/Common/Models/Response'
import { Maze, Interaction } from '@Infrastructure/Persistence/Connection'
import MazeEntity from '@Domain/Entities/Maze'
import InteractionEntity from '@Domain/Entities/Interaction'
import MazeDto from '@Application/Maze/queries/MazeDto'
import EnumTypeInteractions from '@Domain/Enumerations/EnumTypeInteractions'

export interface GetAllMazeQuery { 
    sessionId: string
}

export abstract class GetAllMazeQueryHadler {
    public static async handle(request: GetAllMazeQuery): Promise<Response<Array<MazeDto>>> {
        try {
            if (!request.sessionId) throw new Error('Session invalid.')
            
            const listMaze: Array<MazeEntity> = await Maze.Find()

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

            if (!result) return new Response<Array<MazeDto>>('Could not find a maze.')
            return new Response<Array<MazeDto>>('Found mazes.', result)
        } catch (exception: any) {
            return new Response<Array<MazeDto>>(exception.message)
        }
    }
}