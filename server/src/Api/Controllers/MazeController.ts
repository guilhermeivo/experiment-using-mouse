import Response from '@Application/Common/Models/Response'
import Maze from '@Domain/Entities/Maze'
import { GetByIdMazeQuery, GetByIdMazeQueryHadler } from '@Application/Maze/queries/GetByIdMazeQuery'
import { GetAllMazeQuery, GetAllMazeQueryHadler } from '@Application/Maze/queries/GetAllMazeQuery'
import { CreateMazeCommand, CreateMazeCommandHandler } from '@Application/Maze/commands/CreateMazeCommand'
import { AddLikeMazeCommand, AddLikeMazeCommandHandler } from '@Application/Maze/commands/AddLikeMazeCommand'
import { AddViewMazeCommand, AddViewMazeCommandHandler } from '@Application/Maze/commands/AddViewMazeCommand'

export default class MazeController {
    async GetAll(request: GetAllMazeQuery): Promise<Response<Array<Maze>>> {
        const response = await GetAllMazeQueryHadler.handle(request)

        if (response.Succeeded) {
            return response
        }
        return response
    }

    async GetById(request: GetByIdMazeQuery): Promise<Response<Array<Maze>>> {
        const response = await GetByIdMazeQueryHadler.handle(request)
        
        if (response.Succeeded) {
            return response
        }

        return response       
    }

    async Create(request: CreateMazeCommand): Promise<Response<string>> {
        const response = await CreateMazeCommandHandler.handle(request)

        if (response.Succeeded) {
            return response
        }

        return response   
    }

    async AddLikes(request: AddLikeMazeCommand): Promise<Response<string>> {
        const response = await AddLikeMazeCommandHandler.handle(request)

        if (response.Succeeded) {
            return response
        }

        return response   
    }

    async AddViews(request: AddViewMazeCommand): Promise<Response<string>> {
        const response = await AddViewMazeCommandHandler.handle(request)

        if (response.Succeeded) {
            return response
        }

        return response   
    }
}