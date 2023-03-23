import Response from '@Application/Common/Response'
import { openConnection, closeConnection} from '@Infrastructure/Persistence/connection'
import Maze from '@Domain/Entities/Maze'

export interface AddViewMazeCommand {
    id: string
}

export abstract class AddViewMazeCommandHandler {
    public static async handle(request: AddViewMazeCommand) {
        try {
            if (!request.id) throw new Error('need id to update')
            const context = openConnection()
            const resultGet: Maze = await new Promise((resolve, reject) => {
                const sql = `select * from mazes
                    where mazes.id = '${ request.id }'`
                return context.get(sql, (error, row: Maze) => {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        return resolve(row)
                    })
            })

            const resultUpdate: string = await new Promise((resolve, reject) => {
                const sql = `update mazes
                    set views = '${ resultGet.views + 1 }'
                        where mazes.id = '${ request.id }'`
                return context.run(sql, function(error) {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        return resolve(this.lastID.toString())
                    })
            })
            closeConnection(context)

            return new Response<string>('sucess update', resultUpdate)
        } catch (exception: any) {
            return new Response<string>(exception.message)
        }
    }
}