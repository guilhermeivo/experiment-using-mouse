import db from '../../persistence'

export default () => {
    db.defineTable('interaction', {
        id: {
            type: db.dataTypes.NUMBER,
            [db.constraint.primaryKey]: true,
            [db.constraint.autoIncrement]: true
        },
        userId: {
            type: db.dataTypes.NUMBER
        },
        mazeId: {
            type: db.dataTypes.NUMBER
        },
        type: {
            type: db.dataTypes.STRING,
            [db.constraint.notNull]: true
        },
    }, {
        reference: {
            userId: {
                'user': 'id'
            },
            mazeId: {
                'maze': 'id'
            }
        }
    })
}