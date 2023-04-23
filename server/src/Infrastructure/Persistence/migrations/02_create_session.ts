import { _context } from '@Infrastructure/Persistence/connection'

export default async () => {
    const sqlCreate = `
    create table if not exists session (
        id integer primary key autoincrement,
        token string,
        createdOn string,
        createdByIp string,
        revokedOn string,
        revokedByIp string
    )`
    const sqlSelect = `select * from session`
    _context.serialize(() => {
        _context.run(sqlCreate, (error: Error) => {
            if (error) console.error(error.message)
        })
    })
    _context.serialize(() => {
        _context.get(sqlSelect, (error, row) => {
            if (error) {
                return console.error(error.message)
            } 
            console.log('Successfully created Session table.')
        })
    })
}
