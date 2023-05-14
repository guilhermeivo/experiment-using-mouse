import db from "../connection"

export default () => {
    db.serialize(() => {
        db.run(`
        create table maze (
            id integer primary key autoincrement,
            userId integer,
            fileId integer,
            name text not null,
            description text,
            createdAt date,
            createdByIp text,
            foreign key (userId)
                references user (id)
            foreign key (fileId)
                references file (id)
            )`, (error) => {
                if (error) return

                console.log('Successfully created maze table')
            })
    })
}