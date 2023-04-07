import Response from '@Application/Common/Models/Response'
import { Maze } from '@Infrastructure/Persistence/Connection'
import MazeEntity from '@Domain/Entities/Maze'
import MazeAddLikeEvent from '@Domain/Events/MazeAddLikeEvent'

export interface AddLikeMazeCommand {
    sessionId: string
    id: string
}

export abstract class AddLikeMazeCommandHandler {
    public static async handle(request: AddLikeMazeCommand) {
        try {
            if (!request.id) throw new Error('Need id to add.')

            var maze = [...await Maze.Where((x: MazeEntity) => x.id == request.id)][0]

            if (maze) {
                maze = MazeAddLikeEvent(maze)

                await Maze.Update(maze, (x: MazeEntity) => x.id == request.id)
    
                return new Response<string>('Successfully added.', request.id)
            } else {
                throw new Error('Invalid id.')
            }
            
        } catch (exception: any) {
            return new Response<string>(exception.message)
        }
    }
}