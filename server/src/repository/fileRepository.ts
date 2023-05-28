import GenericRepository from "../common/models/GenericRepository"
import file from "../entities/file"

const tableName = 'file'

class FileRepository extends GenericRepository<file> { }

export default new FileRepository(tableName)