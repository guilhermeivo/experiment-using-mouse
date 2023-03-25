import Response from '@Application/Common/Response'
import { _context } from '@Infrastructure/Persistence/connection'
import Maze from '@Domain/Entities/Maze'

export interface GetByIdMazeQuery {
    id: string
}

export abstract class GetByIdMazeQueryHadler {
    public static async handle(request: GetByIdMazeQuery) {
        try {
            if (!request.id) throw new Error('need id to search')
            
            const result: Maze = await new Promise((resolve, reject) => {
                const sql = `select * from mazes
                    where mazes.id = '${ request.id }'`
                return _context.get(sql, (error, row: Maze) => {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        return resolve(row)
                    })
            })
            
            if (!result) return new Response<Array<Maze>>('could not find a maze with that value')
            return new Response<Array<Maze>>('sucess search', [result])

        } catch (exception: any) {
            return new Response<Array<Maze>>(exception.message)
        }
    }
}