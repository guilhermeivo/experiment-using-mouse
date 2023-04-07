import { _context } from '@Infrastructure/Persistence/Connection'

export default function DBSet<T extends object>(tableName: string) {

    const Find = async (): Promise<Array<T | any>> => {
        const sqlSelect = `select * from ${ tableName }`

        const result: Array<T> = await new Promise((resolve, reject) => {                
            _context.serialize(() => {
                return _context.all(sqlSelect, (error, rows: Array<T>) => {
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

    const Add = async (entity: T): Promise<string> => {
        const valuesName = Object.keys(entity).map((key, index) => {
            if (entity[key as keyof typeof entity]) return (key)
        }).filter(Boolean).join(', ')

        const values = Object.keys(entity).map((key, index) => {
            if (entity[key as keyof typeof entity] && typeof entity[key as keyof typeof entity] === 'string')
                return `'${ entity[key as keyof typeof entity] }'`
            else return entity[key as keyof typeof entity]
        }).filter(Boolean).join(', ')

        const sqlInsert = `insert into ${ tableName } (${ valuesName }) values (${ values })`
        
        return await new Promise((resolve, reject) => {
            _context.serialize(() => {
                return _context.run(sqlInsert, function(error) {
                    if (error) {
                        console.error(error.message)
                        return reject(error.message)
                    }
                    return resolve(this.lastID.toString())
                })
            })
        })
    }

    const Where = async (callbackWhere: Function): Promise<Array<T | any>> => {
        const entity = await Find()
        
        return entity.map((entity: T) => callbackWhere(entity) && entity).filter(Boolean)
    }

    const Update = async (newEntity: T, callbackWhere: Function) => {
        const entity = [...await Where(callbackWhere)][0]

        Object.keys(entity).map((key, index) => {
            if (entity[key as keyof typeof entity] === newEntity[key as keyof typeof newEntity]) delete newEntity[key as keyof typeof newEntity]
        })

        const valuesName = Object.keys(newEntity).map((key, index) => {
            if (newEntity[key as keyof typeof newEntity]) return (key)
        }).filter(Boolean)

        const values = Object.keys(newEntity).map((key, index) => {
            if (newEntity[key as keyof typeof newEntity] && typeof newEntity[key as keyof typeof newEntity] === 'string')
                return `'${ newEntity[key as keyof typeof newEntity] }'`
            else return newEntity[key as keyof typeof newEntity]
        }).filter(Boolean)

        const setValues = Object.keys(newEntity).map((key, index) => `${ valuesName[index] } = ${ values[index] }`).filter(Boolean).join(', ')

        const sqlUpdate = `update ${ tableName } set ${ setValues } where ${ tableName }.rowid = '${ entity.id }'`

        await new Promise((resolve, reject) => {
            _context.serialize(() => {
                return _context.run(sqlUpdate, function(error) {
                    if (error) {
                        console.error(error.message)
                        return reject(error.message)
                    }
                    return resolve('')
                })
            })
        })
    }

    const Count = async (callbackWhere: Function): Promise<string> => {
        const found = await Where(callbackWhere)

        return found.length.toString()
    }

    return ({
        Find: () => Find(),
        Where: (callback: Function) => Where(callback),
        Add: (entity: T) => Add(entity),
        Remove: () => { },
        Update: (entity: T, callback: Function) => Update(entity, callback),
        Count: (callback: Function) => Count(callback)
    })
}

