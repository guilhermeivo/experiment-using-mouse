import PaginatedList from "../../../common/models/PaginatedList"
import Result from "../../../common/models/Result"
import mazeRepository from "../../../repository/mazeRepository"
import responseMaze from "./responseMaze"

interface requestGetWithPagination {
    userId: number
    pageNumber: number
    pageSize: number
}

export default async (request: requestGetWithPagination) => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)
    if (!request.pageNumber || !request.pageSize) return new Result(`Not all data was provided.`)

    const mazeEntity = await mazeRepository.pagination(request.pageSize, request.pageNumber)
    const { count } = await mazeRepository.findAndCount()

    const result: Array<object> = []
    await Promise.all(
        mazeEntity.map(async maze => {
            result.push(await responseMaze(maze, request.userId))
        }))

    return new Result('maze', new PaginatedList<object>(result, count, request.pageNumber, request.pageSize))
}