import GenericRepository from "../common/models/GenericRepository"
import token from "../entities/token"

const tableName = 'token'

class TokenRepository extends GenericRepository<token> { }

export default new TokenRepository(tableName)