import enumTypeInteractions from "../../../common/enumerations/enumTypeInteractions"
import Result from "../../../common/models/Result"
import interactionRepository from "../../../repository/interactionRepository"
import mazeRepository from "../../../repository/mazeRepository"

interface requestToggleLike {
    id: number
    userId: number
}

export default async (request: requestToggleLike): Promise<Result<number>> => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)
    if (!request.id) return new Result(`Not all data was provided.`)

    const findMaze = await mazeRepository.findById(request.id)
    if (!findMaze) return new Result(`Could not find any matching values.`)

    const findInteraction = await interactionRepository.find({
        where: {
            userId: request.userId,
            mazeId: request.id,
            type: enumTypeInteractions.Liked.toString()
        }
    })
    if (findInteraction.length > 0) {
        const removeInteraction = interactionRepository.destroy({
            where: {
                userId: request.userId,
                mazeId: request.id,
                type: enumTypeInteractions.Liked.toString()
            }
        })
        if (!removeInteraction) return new Result('An error occurred while executing the function.')

        return new Result<number>('Removed like!', request.id)
    } else {
        const addLike = await interactionRepository.addLike(request.userId, request.id)
        if (!addLike) return new Result('An error occurred while executing the function.')

        return new Result<number>('Add like!', request.id)
    }
}