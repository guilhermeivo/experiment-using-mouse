import Response from '@Application/Common/Models/Response'
import { Maze } from '@Infrastructure/Persistence/Connection'
import MazeEntity from '@Domain/Entities/Maze'
import MazeAddViewEvent from '@Domain/Events/MazeAddViewEvent'

export interface AddViewMazeCommand {
    sessionId: string
    id: string
}

export abstract class AddViewMazeCommandHandler {
    public static async handle(request: AddViewMazeCommand) {
        try {
            if (!request.id) throw new Error('Need id to add.')
            
            var maze = [...await Maze.Where((x: MazeEntity) => x.id == request.id)][0]

            if (maze) {
                maze = MazeAddViewEvent(maze)

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