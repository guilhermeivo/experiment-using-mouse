import db from "../connection"

export default () => {
    db.serialize(() => {
        db.run(`
        create table user (
            id integer primary key autoincrement,
            email text not null,
            username text not null,
            emailConfirmed boolean,
            createdAt date,
            createdByIp text
            )`, (error) => {
                if (error) return

                console.log('Successfully created user table.')
            })
    })
}