import genericRepository from "../common/interfaces/repositoryBase";
import { Add, Count, Find, Remove, Update, Where } from "../db/serialize";
import user from "../entities/user";

const tableName = 'user'

const userRepository: genericRepository<user> = {
    Add: async (entity) => Add<user>(tableName, entity),
    Find: async () => Find<user>(tableName),
    Where: async (callbackWhere) => Where<user>(tableName, callbackWhere),
    Remove: async (callbackWhere) => Remove<user>(tableName, callbackWhere),
    Update: async (newEntity, callbackWhere) => Update<user>(tableName, newEntity, callbackWhere),
    Count: async (callbackWhere) => Count<user>(tableName, callbackWhere)
}

export default userRepository