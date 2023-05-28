import db from '../../persistence'

export default () => {
    db.defineTable('user', {
        id: {
            type: db.dataTypes.NUMBER,
            [db.constraint.primaryKey]: true,
            [db.constraint.autoIncrement]: true
        },
        email: {
            type: db.dataTypes.STRING,
            [db.constraint.notNull]: true
        },
        username: {
            type: db.dataTypes.STRING,
            [db.constraint.notNull]: true
        },
        emailConfirmed: {
            type: db.dataTypes.BOOL
        },
        createdAt: {
            type: db.dataTypes.DATE
        },
        createdByIp: {
            type: db.dataTypes.STRING
        }
    })
}
