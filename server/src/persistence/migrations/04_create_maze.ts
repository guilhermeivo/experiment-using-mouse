import db from '../../persistence'

export default () => {
    db.defineTable('maze', {
        id: {
            type: db.dataTypes.NUMBER,
            [db.constraint.primaryKey]: true,
            [db.constraint.autoIncrement]: true
        },
        userId: {
            type: db.dataTypes.NUMBER
        },
        fileId: {
            type: db.dataTypes.NUMBER
        },
        name: {
            type: db.dataTypes.STRING,
            [db.constraint.notNull]: true
        },
        description: {
            type: db.dataTypes.STRING,
            [db.constraint.notNull]: true
        },
        createdAt: {
            type: db.dataTypes.DATE
        },
        createdByIp: {
            type: db.dataTypes.STRING
        }
    }, {
        reference: {
            userId: {
                'user': 'id'
            },
            fileId: {
                'file': 'id'
            }
        }
    })
}