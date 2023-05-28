import db from '../../persistence'

export default () => {
    db.defineTable('file', {
        id: {
            type: db.dataTypes.NUMBER,
            [db.constraint.primaryKey]: true,
            [db.constraint.autoIncrement]: true
        },
        fileName: {
            type: db.dataTypes.STRING,
            [db.constraint.notNull]: true
        },
        contentType: {
            type: db.dataTypes.STRING,
            [db.constraint.notNull]: true
        },
        filePath: {
            type: db.dataTypes.STRING,
            [db.constraint.notNull]: true
        },
        size: {
            type: db.dataTypes.NUMBER,
            [db.constraint.notNull]: true
        },
        createdAt: {
            type: db.dataTypes.DATE
        },
        createdByIp: {
            type: db.dataTypes.STRING
        },
        updatedAt: {
            type: db.dataTypes.DATE
        },
        updatedByIp: {
            type: db.dataTypes.STRING
        }
    })
}