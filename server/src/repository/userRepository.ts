import GenericRepository from "../common/models/GenericRepository";
import user from "../entities/user";

const tableName = 'user'

class UserRepository extends GenericRepository<user> {
    findByEmail(email: string) {
        return this.findOne({
            where: {
                email: email
            }
        })
    }    
}

export default new UserRepository(tableName)