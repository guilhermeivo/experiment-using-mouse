import { _context } from '@Infrastructure/Persistence/connection'

export default async () => {
    const sql = `
    create table if not exists mazes (
        id integer primary key autoincrement,
        name string,
        likes integer,
        views integer,
        description string,
        ipAdress string,
        encodedString string
    )`
    _context.run(sql, (error: Error) => {
        if (error) {
            console.error(error.message)
        } else {
            console.log('Successfully created Mazes table')
        }
    })
}
