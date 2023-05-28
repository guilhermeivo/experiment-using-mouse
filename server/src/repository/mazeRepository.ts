import GenericRepository from "../common/models/GenericRepository"
import maze from "../entities/maze"

const tableName = 'maze'

class MazeRepository extends GenericRepository<maze> { }

export default new MazeRepository(tableName)