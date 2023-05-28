import Result from "../../../common/models/Result"
import mazeRepository from "../../../repository/mazeRepository"
import responseMaze from "./responseMaze"

interface requestByUser {
    userId: number
}

export default async (request: requestByUser) => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)

    const findMaze = await mazeRepository.find({
        where: {
            userId: request.userId
        }
    })
    if (findMaze.length <= 0) return new Result(`Could not find any matching values.`, [])

    const result: Array<object> = []
    await Promise.all(
        findMaze.map(async maze => {
            result.push(await responseMaze(maze, request.userId))
        }))

    return new Result('Get Maze By User!', result)
}