import genericRepository from "../common/interfaces/repositoryBase"
import { Add, Count, Find, Remove, Update, Where } from "../db/serialize"
import token from "../entities/token"

const tableName = 'token'

const tokenRepository: genericRepository<token> = {
    Add: async (entity) => Add<token>(tableName, entity),
    Find: async () => Find<token>(tableName),
    Where: async (callbackWhere) => Where<token>(tableName, callbackWhere),
    Remove: async (callbackWhere) => Remove<token>(tableName, callbackWhere),
    Update: async (newEntity, callbackWhere) => Update<token>(tableName, newEntity, callbackWhere),
    Count: async (callbackWhere) => Count<token>(tableName, callbackWhere)
}

export default tokenRepository