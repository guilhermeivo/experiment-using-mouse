import Result from "../../../common/models/Result"
import mazeRepository from "../../../repository/mazeRepository"
import db from '../../../persistence'
import responseMaze from "./responseMaze"
import PaginatedList from "../../../common/models/PaginatedList"
import validators from "@experiment-using-mouse/validators"

interface requestGetBySearchWithPagination {
    userId: number
    pageNumber: number
    pageSize: number
    q: string
    sortBy: string
    filters: string
}

export default async (request: requestGetBySearchWithPagination): Promise<Result<PaginatedList<object>>> => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)
    if (!request.pageNumber || !request.pageSize) return new Result(`Not all data was provided.`)
    if (request.sortBy && !['alphabetical', 'releaseDate', 'likes'].includes(request.sortBy)) return new Result(`Not all data was provided.`)
    
    const mazeEntity = await mazeRepository.pagination(request.pageSize, request.pageNumber, {
        where: {
            name: {
                [db.operators.like]: `%${ request.q }%` 
            }
        }
    })
    const { count } = await mazeRepository.findAndCount({
        where: {
            name: {
                [db.operators.like]: `%${ request.q }%` 
            }
        }
    })

    const result: Array<object> = []
    await Promise.all(
        mazeEntity.map(async maze => {
            result.push(await responseMaze(maze, request.userId))
        }))

    return new Result<PaginatedList<object>>('maze', new PaginatedList<object>(result, count, request.pageNumber, request.pageSize))
}