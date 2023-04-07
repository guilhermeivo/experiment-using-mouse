import Response from '@Application/Common/Models/Response'
import MazeEntity from '@Domain/Entities/Maze'
import SessionEntity from '@Domain/Entities/Session'
import { Maze, Session } from '@Infrastructure/Persistence/Connection'

export interface CreateMazeCommand {
    name: string,
    description: string
    encodedString: string
    sessionId: string
}

export abstract class CreateMazeCommandHandler {
    public static async handle(request: CreateMazeCommand) {
        try {
            if (!request.name || !request.encodedString || !request.sessionId) throw new Error('Missing values.')

            const result: SessionEntity = [...await Session.Where((x: SessionEntity) => x.token === request.sessionId)][0]

            if (result.id) {
                let entity: MazeEntity = {
                    name: request.name,
                    sessionId: result.id,
                    description: request.description,
                    encodedString: request.encodedString
                }
    
                const mazeId = await Maze.Add(entity)
    
                return new Response<string>('Created maze.', mazeId)
            } else {
                throw new Error('Session invalid.')
            }
            
        } catch (exception: any) {
            return new Response<string>(exception.message)
        }
    }
}