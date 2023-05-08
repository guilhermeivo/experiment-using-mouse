import genericRepository from "../common/interfaces/repositoryBase"
import { Add, Count, Find, Remove, Update, Where } from "../db/serialize"
import maze from "../entities/maze"

const tableName = 'maze'

const mazeRepository: genericRepository<maze> = {
    Add: async (entity) => Add<maze>(tableName, entity),
    Find: async () => Find<maze>(tableName),
    Where: async (callbackWhere) => Where<maze>(tableName, callbackWhere),
    Remove: async (callbackWhere) => Remove<maze>(tableName, callbackWhere),
    Update: async (newEntity, callbackWhere) => Update<maze>(tableName, newEntity, callbackWhere),
    Count: async (callbackWhere) => Count<maze>(tableName, callbackWhere)
}

export default mazeRepository
