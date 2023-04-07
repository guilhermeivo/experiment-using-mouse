import { _context } from '@Infrastructure/Persistence/Connection'

export default async () => {
    const sqlCreate = `
    create table if not exists interaction (
        id integer primary key autoincrement,
        sessionId intenger,
        mazeId intenger,
        type intenger,
        foreign key (sessionId)
            references session (id)
        foreign key (mazeId)
            references mazes (id)
    )`
    const sqlSelect = `select * from interaction`
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
            console.log('Successfully created Interaction table.')
        })
    })
}
