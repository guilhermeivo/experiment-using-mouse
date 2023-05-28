import db from '../../persistence'

export default () => {
    db.defineTable('token', {
        id: {
            type: db.dataTypes.NUMBER,
            [db.constraint.primaryKey]: true,
            [db.constraint.autoIncrement]: true
        },
        userId: {
            type: db.dataTypes.NUMBER
        },
        token: {
            type: db.dataTypes.STRING,
            [db.constraint.notNull]: true
        },
        expirationTime: {
            type: db.dataTypes.DATE,
            [db.constraint.notNull]: true
        },
        createdAt: {
            type: db.dataTypes.DATE
        },
        createdByIp: {
            type: db.dataTypes.STRING
        },
        revokedAt: {
            type: db.dataTypes.DATE
        },
        revokedByIp: {
            type: db.dataTypes.STRING
        },
        type: {
            type: db.dataTypes.STRING
        }
    }, {
        reference: {
            userId: {
                'user': 'id'
            }
        }
    })
}