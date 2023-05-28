import enumTypeInteractions from "../common/enumerations/enumTypeInteractions"
import GenericRepository from "../common/models/GenericRepository"
import interaction from "../entities/interaction"

const tableName = 'interaction'

class InteractionRepository extends GenericRepository<interaction> {
    addLike(userId: number, mazeId: number) {
        const entity: interaction = {
            mazeId: mazeId,
            userId: userId,
            type: enumTypeInteractions.Liked.toString()
        }
    
        return this.add(entity)
    }

    addView(userId: number, mazeId: number) {
        const entity: interaction = {
            mazeId: mazeId,
            userId: userId,
            type: enumTypeInteractions.Visualized.toString()
        }
    
        return this.add(entity)
    }
}

export default new InteractionRepository(tableName)