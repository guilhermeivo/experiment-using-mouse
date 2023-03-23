import { Database, verbose }  from 'sqlite3'
require('dotenv').config()

const sqlite3 = verbose()

export function openConnection() {
    const contextDb = new sqlite3.Database('./Infrastructure/Persistence/database.sqlite', (error) => {
        if (error) {
            return console.error(error.message)
        }
    })
    return contextDb
}

export function closeConnection(contextDb: Database) {
    contextDb.close((error) => {
        if (error) {
            return console.error(error.message)
        }
    })
}
    