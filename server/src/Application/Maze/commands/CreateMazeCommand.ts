import Response from '@Application/Common/Models/Response'
import { _context } from '@Infrastructure/Persistence/connection'

export interface CreateMazeCommand {
    name: string,
    description: string
    encodedString: string
}

export abstract class CreateMazeCommandHandler {
    public static async handle(request: CreateMazeCommand) {
        try {
            if (!request.name || !request.encodedString) throw new Error('Missing values.')
            
            const result: string = await new Promise((resolve, reject) => {
                const sql = `insert into mazes (name, description, ipAdress, encodedString)
                values ('${ request.name }', '${ request.description }', '', '${ request.encodedString }')`

                _context.serialize(() => {
                    return _context.run(sql, function(error) {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        return resolve(this.lastID.toString())
                    })
                })
            })

            return new Response<string>('Created maze.', result)
        } catch (exception: any) {
            return new Response<string>(exception.message)
        }
    }
}