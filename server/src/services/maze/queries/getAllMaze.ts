import Result from "../../../common/models/Result"
import mazeRepository from "../../../repository/mazeRepository"
import responseMaze from "./responseMaze"

interface requestGetAll {
    userId: number
}

export default async (request: requestGetAll) => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)

    const findMaze = await mazeRepository.find()

    const result: Array<object> = []
    await Promise.all(
        findMaze.map(async maze => {
            result.push(await responseMaze(maze, request.userId))
        }))

    return new Result('Get All Mazes!', result)
}