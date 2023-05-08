import db from "../connection"

export default () => {
    db.serialize(() => {
        db.run(`
        create table token (
            id integer primary key autoincrement,
            userId integer,
            token text not null,
            expirationTime date not null,
            createdAt date,
            createdByIp text,
            revokedAt date,
            revokedByIp text,
            type text,
            foreign key (userId)
                references user (id)
            )`, (error) => {
                if (error) return

                console.log('Successfully created token table.')
            })
    })
}