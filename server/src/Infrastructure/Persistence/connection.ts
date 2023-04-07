import Maze from '@Domain/Entities/Maze'
import { Database, verbose }  from 'sqlite3'
import DBSet from '@Infrastructure/Persistence/DBSet'
import Interaction from '@Domain/Entities/Interaction'
require('dotenv').config()

const sqlite3 = verbose()
const databaseUrl = process.env.DATABASE_URL || ''
export let _context:Database


export let Maze = DBSet<Maze>('mazes')
export let Interaction = DBSet<Interaction>('interaction')

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