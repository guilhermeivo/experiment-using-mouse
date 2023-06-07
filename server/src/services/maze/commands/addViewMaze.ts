import enumTypeInteractions from "../../../common/enumerations/enumTypeInteractions"
import Result from "../../../common/models/Result"
import interactionRepository from "../../../repository/interactionRepository"
import mazeRepository from "../../../repository/mazeRepository"

interface requestAddView {
    id: number
    userId: number
}

export default async (request: requestAddView): Promise<Result<number>> => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)
    if (!request.id) return new Result(`Not all data was provided.`)

    const findMaze = await mazeRepository.findById(request.id)
    if (!findMaze) return new Result(`Could not find any matching values.`)

    const findInteraction = await interactionRepository.find({
        where: {
            userId: request.userId,
            mazeId: request.id,
            type: enumTypeInteractions.Visualized.toString()
        }
    })
    if (findInteraction.length > 0) return new Result<number>('This user has already performed this interaction.', request.id)

    const addView = await interactionRepository.addView(request.userId, request.id)
    if (!addView) return new Result('An error occurred while executing the function.')

    return new Result<number>('Add view!', request.id)
}