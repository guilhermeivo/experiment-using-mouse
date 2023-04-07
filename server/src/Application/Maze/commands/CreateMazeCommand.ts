import Response from '@Application/Common/Models/Response'
import MazeEntity from '@Domain/Entities/Maze'
import { Maze } from '@Infrastructure/Persistence/Connection'

export interface CreateMazeCommand {
    name: string,
    description: string
    encodedString: string
    sessionId: string
}

export abstract class CreateMazeCommandHandler {
    public static async handle(request: CreateMazeCommand): Promise<Response<string>> {
        try {
            if (!request.sessionId) throw new Error('Session invalid.')
            if (!request.name || !request.encodedString) throw new Error('Missing values.')
            
            let entity: MazeEntity = {
                name: request.name,
                sessionId: request.sessionId,
                description: request.description,
                encodedString: request.encodedString,
                createdOn: new Date().toISOString()
            }

            const mazeId = await Maze.Add(entity)

            return new Response<string>('Maze successfully created.', mazeId)
        } catch (exception: any) {
            return new Response<string>(exception.message)
        }
    }
}