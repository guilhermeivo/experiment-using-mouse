import Response from '@Application/Common/Models/Response'
import { _context } from '@Infrastructure/Persistence/connection'
import Maze from '@Domain/Entities/Maze'

export interface AddLikeMazeCommand {
    id: string
}

export abstract class AddLikeMazeCommandHandler {
    public static async handle(request: AddLikeMazeCommand) {
        try {
            if (!request.id) throw new Error('Need id to add.')

            const resultGet: Maze = await new Promise((resolve, reject) => {
                const sql = `select * from mazes
                    where mazes.id = '${ request.id }'`
                
                _context.serialize(() => {
                    return _context.get(sql, (error, row: Maze) => {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        return resolve(row)
                    })
                })
            })

            const resultUpdate: string = await new Promise((resolve, reject) => {
                const sql = `update mazes
                    set likes = '${ resultGet.likes + 1 }'
                        where mazes.id = '${ request.id }'`

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

            return new Response<string>('Successfully added.', resultUpdate)
        } catch (exception: any) {
            return new Response<string>(exception.message)
        }
    }
}