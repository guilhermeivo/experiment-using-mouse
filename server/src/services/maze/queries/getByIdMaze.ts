import Result from "../../../common/models/Result"
import mazeRepository from "../../../repository/mazeRepository"
import responseMaze from "./responseMaze"

interface requestGetById {
    id: number
    userId: number
}

export default async (request: requestGetById) => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)
    if (!request.id) return new Result(`Not all data was provided.`)

    const findMaze = await mazeRepository.findById(request.id)
    if (!findMaze) return new Result(`Could not find any matching values.`)

    return new Result('Get Maze By Id!', await responseMaze(findMaze, request.userId))
}