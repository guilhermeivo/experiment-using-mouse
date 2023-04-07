import { _context } from '@Infrastructure/Persistence/Connection'

export default async () => {
    const sqlCreate = `
    create table if not exists mazes (
        id integer primary key autoincrement,
        sessionId intenger,
        name string not null,
        likes integer,
        views integer,
        description string,
        createdByIp string,
        encodedString string not null,
        foreign key (sessionId)
            references session (id)
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
