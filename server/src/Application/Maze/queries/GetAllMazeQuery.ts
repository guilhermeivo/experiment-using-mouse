import Response from '@Application/Common/Response'
import { openConnection, closeConnection} from '@Infrastructure/Persistence/connection'
import Maze from '@Domain/Entities/Maze'

export interface GetAllMazeQuery { }

export abstract class GetAllMazeQueryHadler {
    public static async handle(request: GetAllMazeQuery) {
        try {
            const context = await openConnection()
            const result: Array<Maze> = await new Promise((resolve, reject) => {
                const sql = `select * from mazes`
                return context.all(sql, (error, rows: Array<Maze>) => {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        return resolve(rows)
                    })
            })
            closeConnection(context)

            return new Response<Array<Maze>>('sucess search', result)
        } catch (exception: any) {
            return new Response<Array<Maze>>(exception.message)
        }
    }
}