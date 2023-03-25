import Response from '@Application/Common/Response'
import { _context } from '@Infrastructure/Persistence/connection'

export interface CreateMazeCommand {
    name: string,
    description: string
    ipAdress: string,
    encodedString: string
}

export abstract class CreateMazeCommandHandler {
    public static async handle(request: CreateMazeCommand) {
        try {
            if (!request.name || !request.ipAdress || !request.encodedString) throw new Error('missing values')
            const result: string = await new Promise((resolve, reject) => {
                const sql = `insert into mazes (name, description, ipAdress, encodedString)
                values ('${ request.name }', '${ request.description }', '${ request.ipAdress }', '${ request.encodedString }')`
                return _context.run(sql, function(error) {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        return resolve(this.lastID.toString())
                    })
            })

            return new Response<string>('sucess created', result)
        } catch (exception: any) {
            return new Response<string>(exception.message)
        }
    }
}