import Result from "../../../common/models/Result"
import mazeRepository from "../../../repository/mazeRepository"
import responseMaze from "./responseMaze"

interface requestByUser {
    userId: number
}

export default async (request: requestByUser): Promise<Result<Array<object>>> => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)

    const findMaze = await mazeRepository.find({
        where: {
            userId: request.userId
        }
    })
    const result: Array<object> = []
    if (findMaze.length <= 0) return new Result(`Could not find any matching values.`, result)

    await Promise.all(
        findMaze.map(async maze => {
            result.push(await responseMaze(maze, request.userId))
        }))

    return new Result<Array<object>>('Get Maze By User!', result)
}