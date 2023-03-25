import Response from '@Application/Common/Response'
import { _context } from '@Infrastructure/Persistence/connection'
import Maze from '@Domain/Entities/Maze'

export interface GetAllMazeQuery { }

export abstract class GetAllMazeQueryHadler {
    public static async handle(request: GetAllMazeQuery) {
        try {
            const result: Array<Maze> = await new Promise((resolve, reject) => {
                const sql = `select * from mazes`
                return _context.all(sql, (error, rows: Array<Maze>) => {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        return resolve(rows)
                    })
            })

            return new Response<Array<Maze>>('sucess search', result)
        } catch (exception: any) {
            return new Response<Array<Maze>>(exception.message)
        }
    }
}