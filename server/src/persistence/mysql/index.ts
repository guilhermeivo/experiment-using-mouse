import mysql from 'mysql2'
import * as dotenv from 'dotenv'
import migrate from '../migrate'
import { constraint, createTableStatement, deleteStatement, optionsCreateTable, optionsDelete, optionsUpdate, selectStatement, updateStatement } from './statement'
import { dataTypes, operators } from './dataTypes'
import { optionsSelect } from './statement'
dotenv.config()

let connection: mysql.Connection

const host = process.env.MYSQL_HOST || ''
const user = process.env.MYSQL_USER || ''
const password = process.env.MYSQL_PASSWORD || ''
const database = process.env.MYSQL_DB || ''

const initialize = () => {
    connection = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    })       
    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack)
          return
        }
      
        console.log('[MYSQL] Connected as id ' + connection.threadId)
    })
    migrate()
}

const teardown = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.end(function(err) {
            if (err) reject(err)
            else resolve()
        })
    })
}

// TODO:
const add = async <T extends object>(tableName: string, entity: T): Promise<T> => {
    const valuesName = Object.keys(entity).map((key, index) => {
        if (entity[key as keyof typeof entity]) return (key)
    }).filter(Boolean).join(', ')

    const values = Object.keys(entity).map((key, index) => {
        if (entity[key as keyof typeof entity]) return entity[key as keyof typeof entity]
    }).filter(Boolean)

    const sqlInsert = `insert into ${ tableName } (${ valuesName }) values (${ values.map(() => '?').filter(Boolean) })`

    return await new Promise((resolve, reject) => {
        connection.query(sqlInsert, [...values], async function (error, result: mysql.ResultSetHeader, fields) {
            if (error) {
                console.error(error.message)
                return reject(error.message)
            }

            return resolve([...await findAll<T>(tableName, {
                where: {
                    id: result.insertId
                }
            })][0])
        })
    })
}

const destroy = async <T extends object>(table: string | Array<string>, options: optionsDelete): Promise<T> => {
    const [ sql, payloads ] = deleteStatement(table, options)

    return await new Promise((resolve, reject) => {
        connection.query(sql as string, payloads, async function (error, result, fields) {
            if (error) {
                console.error(error.message)
                return reject(error.message)
            }

            return resolve([...await findAll<T>(table, {
                where: options.where
            })][0])
        })
    })
}

const update = async <T extends object>(table: string | Array<string>, newEntity: T, options: optionsUpdate): Promise<T> => {
    const [ sql, payloads ] = updateStatement(table, {
        attributes: newEntity,
        ...options
    })

    return await new Promise((resolve, reject) => {
        connection.query(sql as string, payloads, async function (error, results, fields) {
            if (error) {
                console.error(error.message)
                return reject(error.message)
            }

            return resolve([...await findAll<T>(table, {
                where: options.where
            })][0])
        })
    })
}

const findAll = async <T extends object>(table: string | Array<string>, options: optionsSelect): Promise<Array<T>> => {
    const [ sql, payloads ] = selectStatement(table, options)

    return await new Promise((resolve, reject) => {
        connection.query(sql as string, payloads, async function (error, results: mysql.RowDataPacket[], fields) {
            if (error) {
                console.error(error.message)
                return reject(error.message)
            }

            return resolve(results as Array<T>)  
        })
    })
}

const defineTable = async (tableName: string, attributes = { }, options: optionsCreateTable = { }) => {
    const createTableSQL = createTableStatement(tableName, attributes, options)

    connection.query(createTableSQL, async function (error, results, fields) {
        if (error) return

        console.log(`[MYSQL] Successfully created ${ tableName } table.`)
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