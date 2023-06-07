import sqlite3 from 'sqlite3'
sqlite3.verbose()
import { constraint, createTableStatement, deleteStatement, optionsCreateTable, optionsDelete, optionsSelect, optionsUpdate, selectStatement, updateStatement } from './statement'
import { dataTypes, operators } from './dataTypes'
import * as dotenv from 'dotenv'
import migrate from '../migrate'
dotenv.config()

let db: sqlite3.Database

const databaseUrl = process.env.DATABASE_URL || ''

const initialize = () => {
    db = new sqlite3.Database(databaseUrl)
    console.log('[SQLITE] Connected as ' + databaseUrl)
    migrate()
}

const teardown = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.close(err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

// TODO:
const add = async <T extends object>(tableName: string, entity: T): Promise<T> => {
    const valuesName = Object.keys(entity).map(key => {
        if (entity[key as keyof typeof entity]) return (key)
    }).filter(Boolean).join(', ')

    const values = Object.keys(entity).map(key => {
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
                return resolve([...await findAll<T>(tableName, {
                    where: {
                        id: this.lastID
                    }
                })][0])
            })
        })
    })
}

const destroy = async <T extends object>(table: string | Array<string>, options: optionsDelete): Promise<T> => {
    const [ sql, payloads ] = deleteStatement(table, options)

    return await new Promise((resolve, reject) => {
        db.serialize(() => {
            return db.run(sql as string, payloads, async function(error) {
                if (error) {
                    console.error(error.message)
                    return reject(error.message)
                }

                return resolve([...await findAll<T>(table, {
                    where: options.where
                })][0])
            })
        })
    })
}

const update = async <T extends object>(table: string | Array<string>, newEntity: T, options: optionsUpdate): Promise<T> => {
    const [ sql, payloads ] = updateStatement(table, {
        attributes: newEntity,
        ...options
    })

    return await new Promise((resolve, reject) => {
        db.serialize(() => {
            return db.run(sql as string, payloads, async function(error) {
                if (error) {
                    console.error(error.message)
                    return reject(error.message)
                }

                return resolve([...await findAll<T>(table, {
                    where: options.where
                })][0])
            })
        })
    })
}

const findAll = async <T extends object>(table: string | Array<string>, options: optionsSelect): Promise<Array<T>> => {
    const [ sql, payloads ] = selectStatement(table, options)

    const result: Array<T> = await new Promise((resolve, reject) => {                
        db.serialize(() => {
            return db.all(sql as string, payloads, (error, rows: Array<T>) => {
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

const defineTable = async (tableName: string, attributes = { }, options: optionsCreateTable = { }) => {
    const createTableSQL = createTableStatement(tableName, attributes, options)

    db.serialize(() => {
        db.run(createTableSQL, (error) => {
            if (error) return

            console.log(`[SQLITE] Successfully created ${ tableName } table.`)
        })
    })
}

export {
    initialize,
    teardown,
    add,
    destroy,
    update,
    defineTable,
    findAll,
    dataTypes,
    operators,
    constraint,
    optionsCreateTable,
    optionsDelete,
    optionsSelect,
    optionsUpdate
}