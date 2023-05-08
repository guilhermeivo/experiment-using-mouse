import db from "./connection"

export const Find =  async <T extends object>(tableName: string): Promise<Array<T | any>> => {
    const sqlSelect = `select * from ${ tableName }`

    const result: Array<T> = await new Promise((resolve, reject) => {                
        db.serialize(() => {
            return db.all(sqlSelect, (error, rows: Array<T>) => {
                if (error) {
                    console.error(error.message)
                    return reject(error.message)
                }
                return resolve(rows)
            })
        })
    })
    
    return result
}

export const Where = async <T extends object>(tableName: string, callbackWhere: Function): Promise<Array<T | any>> => {
    const entity = await Find<T>(tableName)
    
    return entity.map((entity: T) => callbackWhere(entity) && entity).filter(Boolean)
}

export const Add = async <T extends object>(tableName: string, entity: T): Promise<T | any> => {
    const valuesName = Object.keys(entity).map((key, index) => {
        if (entity[key as keyof typeof entity]) return (key)
    }).filter(Boolean).join(', ')

    const values = Object.keys(entity).map((key, index) => {
        if (entity[key as keyof typeof entity]) return entity[key as keyof typeof entity]
    }).filter(Boolean)

    const sqlInsert = `insert into ${ tableName } (${ valuesName }) values (${ values.map(() => '?').filter(Boolean) })`

    return await new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(sqlInsert, [...values], async function(error) {
                if (error) {
                    console.error(error.message)
                    return reject(error.message)
                }
                
                return resolve([...await Where(tableName, (entity: T | any) => entity.id == this.lastID)][0])
            })
        })
    })
}
        
export const Remove = async <T extends object>(tableName: string, callbackWhere: Function) => { 
    const entity = [...await Where<T>(tableName, callbackWhere)][0]

    if (entity) {
        const sqlRemove = `delete from ${ tableName } where ${ tableName }.rowid = ?`

        await new Promise((resolve, reject) => {
            db.serialize(() => {
                return db.run(sqlRemove, entity.id, function(error) {
                    if (error) {
                        console.error(error.message)
                        return reject(error.message)
                    }
                    return resolve(entity.id)
                })
            })
        })
    }
}
        
export const Update = async <T extends object>(tableName: string, newEntity: T, callbackWhere: Function) => {
    const entity = [...await Where<T>(tableName, callbackWhere)][0]

    Object.keys(entity).map((key, index) => {
        if (entity[key as keyof typeof entity] === newEntity[key as keyof typeof newEntity]) delete newEntity[key as keyof typeof newEntity]
    })

    const valuesName = Object.keys(newEntity).map((key, index) => {
        if (newEntity[key as keyof typeof newEntity]) return (key)
    }).filter(Boolean)

    const values = Object.keys(newEntity).map((key, index) => {
        if (newEntity[key as keyof typeof newEntity]) return newEntity[key as keyof typeof newEntity]
    }).filter(Boolean)

    const setValues = Object.keys(newEntity).map((key, index) => `${ valuesName[index] } = ?`).filter(Boolean).join(', ')
    
    if (setValues) {
        const sqlUpdate = `update ${ tableName } set ${ setValues } where ${ tableName }.rowid = ?`

        return await new Promise((resolve, reject) => {
            db.serialize(() => {
                return db.run(sqlUpdate, [...values, entity.id], async function(error) {
                    if (error) {
                        console.error(error.message)
                        return reject(error.message)
                    }

                    return resolve([...await Where(tableName, (entityWhere: T | any) => entityWhere.id == entity.id)][0])
                })
            })
        })
    } 
}
        
export const Count = async <T extends object>(tableName: string, callbackWhere: Function): Promise<string> => {
    const found = await Where<T>(tableName, callbackWhere)

    return found.length.toString()
}