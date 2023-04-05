import Response from '@Application/Common/Models/Response'
import { _context } from '@Infrastructure/Persistence/connection'
import Maze from '@Domain/Entities/Maze'

export interface GetByIdMazeQuery {
    id: string
}

export abstract class GetByIdMazeQueryHadler {
    public static async handle(request: GetByIdMazeQuery) {
        try {
            if (!request.id) throw new Error('Need id maze to search.')

            const result: Maze = await new Promise((resolve, reject) => {
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
            
            if (!result) return new Response<Array<Maze>>('Could not find a maze with that value.')
            return new Response<Array<Maze>>('Found maze with that value.', [ result ])
        } catch (exception: any) {
            return new Response<Array<Maze>>(exception.message)
        }
    }
}