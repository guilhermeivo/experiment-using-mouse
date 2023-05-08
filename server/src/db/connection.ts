import sqlite3 from 'sqlite3'
sqlite3.verbose()
import * as dotenv from 'dotenv'
dotenv.config()

const databaseUrl = process.env.DATABASE_URL || ''

const db = new sqlite3.Database(databaseUrl)
export default db