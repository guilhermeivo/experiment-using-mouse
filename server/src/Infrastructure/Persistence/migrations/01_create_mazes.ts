import { openConnection, closeConnection} from '@Infrastructure/Persistence/connection'

const context = openConnection()

const sql = `
create table mazes (
    id integer primary key autoincrement,
    name string,
    likes integer,
    views integer,
    description string,
    ipAdress string,
    encodedString string
)`
context.serialize(() => {
    context.each(sql, (err) => {
        if (err) {
            console.error(err.message)
        }
        console.log('Successfully created')
    })
})

closeConnection(context)