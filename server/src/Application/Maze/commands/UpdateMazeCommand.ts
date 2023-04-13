import Response from "@Application/Common/Models/Response"
import MazeEntity from "@Domain/Entities/Maze"
import { Maze } from "@Infrastructure/Persistence/Connection"

export interface UpdateMazeCommand {
    id: string
    name: string
    encodedString: string
    sessionId: string
}

export abstract class UpdateMazeCommandHandler {
    public static async handle(request: UpdateMazeCommand): Promise<Response<string>> {
        try {
            if (!request.sessionId) throw new Error('Session invalid.')
            if (!request.id || !request.name || !request.encodedString) throw new Error('Missing values.')

            var maze: MazeEntity = [...await Maze.Where((x: MazeEntity) => x.id == request.id && x.sessionId == request.sessionId)][0]

            if (maze) {
                maze.name = request.name
                maze.encodedString = request.encodedString

                Maze.Update(maze, (x: MazeEntity) => x.id == request.id && x.sessionId == request.sessionId)

                return new Response<string>('Change encodeString successfully', request.id)
            } else {
                throw new Error('Invalid id.')
            }
        } catch (exception: any) {
            return new Response<string>(exception.message)
        }
    }
}