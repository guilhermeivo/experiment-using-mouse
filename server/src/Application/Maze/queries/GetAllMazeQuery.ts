import Response from '@Application/Common/Models/Response'
import { _context } from '@Infrastructure/Persistence/connection'
import Maze from '@Domain/Entities/Maze'

export interface GetAllMazeQuery { }

export abstract class GetAllMazeQueryHadler {
    public static async handle(request: GetAllMazeQuery) {
        try {
            const result: Array<Maze> = await new Promise((resolve, reject) => {
                const sql = `select * from mazes`
                _context.serialize(() => {
                    return _context.all(sql, (error: Error, rows: Array<Maze>) => {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }

                        return resolve(rows)
                    })
                })
            })

            if (!result) return new Response<Array<Maze>>('Could not find a maze.')
            return new Response<Array<Maze>>('Found mazes.', result)
        } catch (exception: any) {
            return new Response<Array<Maze>>(exception.message)
        }
    }
}