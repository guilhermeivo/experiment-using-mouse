import { _context } from '@Infrastructure/Persistence/connection'

export default async () => {
    const sqlCreate = `
    create table if not exists mazes (
        id integer primary key autoincrement,
        name string,
        likes integer,
        views integer,
        description string,
        ipAdress string,
        encodedString string
    )`
    const sqlSelect = `select * from mazes`
    _context.serialize(() => {
        _context.run(sqlCreate, (error: Error) => {
            if (error) {
                return console.error(error.message)
            } 
            
        })
    })
    _context.serialize(() => {
        _context.get(sqlSelect, (error, row) => {
            if (error) {
                return console.error(error.message)
            } 
            console.log('Successfully created Mazes table.')
        })
    })
}
