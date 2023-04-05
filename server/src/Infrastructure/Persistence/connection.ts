import { Database, verbose }  from 'sqlite3'
require('dotenv').config()

const sqlite3 = verbose()
const databaseUrl = process.env.DATABASE_URL || ''
export let _context:Database

export async function openConnection() {
    if (_context) return 
    
    const contextDb = new sqlite3.Database(databaseUrl, (error) => {
        if (error) {
            return console.error(error.message)
        }
        console.log('Connected to the SQlite database.')
    })
    _context = contextDb
}

export function closeConnection() {
    _context.close((error) => {
        if (error) {
            return console.error(error.message)
        }
        console.log('Close the database connection.')
    })
}