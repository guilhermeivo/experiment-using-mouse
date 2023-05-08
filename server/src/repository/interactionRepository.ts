import enumTypeInteractions from "../common/enumerations/enumTypeInteractions"
import genericRepository from "../common/interfaces/repositoryBase"
import { Add, Count, Find, Remove, Update, Where } from "../db/serialize"
import interaction from "../entities/interaction"

const tableName = 'interaction'

const interactionRepository: genericRepository<interaction> = {
    Add: async (entity) => Add<interaction>(tableName, entity),
    Find: async () => Find<interaction>(tableName),
    Where: async (callbackWhere) => Where<interaction>(tableName, callbackWhere),
    Remove: async (callbackWhere) => Remove<interaction>(tableName, callbackWhere),
    Update: async (newEntity, callbackWhere) => Update<interaction>(tableName, newEntity, callbackWhere),
    Count: async (callbackWhere) => Count<interaction>(tableName, callbackWhere),

    AddLike: async (userId: number, mazeId: number) => addLike(userId, mazeId),
    AddView: async (userId: number, mazeId: number) => addView(userId, mazeId)
}

const addLike = (userId: number, mazeId: number) => {
    const entity: interaction = {
        mazeId: mazeId,
        userId: userId,
        type: enumTypeInteractions.Liked.toString()
    }

    return interactionRepository.Add(entity)
}

const addView = (userId: number, mazeId: number) => {
    const entity: interaction = {
        mazeId: mazeId,
        userId: userId,
        type: enumTypeInteractions.Visualized.toString()
    }

    return interactionRepository.Add(entity)
}

export default interactionRepository
