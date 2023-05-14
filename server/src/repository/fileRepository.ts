import genericRepository from "../common/interfaces/repositoryBase"
import { Add, Count, Find, Remove, Update, Where } from "../db/serialize"
import file from "../entities/file"

const tableName = 'file'

const fileRepository: genericRepository<file> = {
    Add: async (entity) => Add<file>(tableName, entity),
    Find: async () => Find<file>(tableName),
    Where: async (callbackWhere) => Where<file>(tableName, callbackWhere),
    Remove: async (callbackWhere) => Remove<file>(tableName, callbackWhere),
    Update: async (newEntity, callbackWhere) => Update<file>(tableName, newEntity, callbackWhere),
    Count: async (callbackWhere) => Count<file>(tableName, callbackWhere)
}

export default fileRepository
