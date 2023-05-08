import db from "../connection"

export default () => {
    db.serialize(() => {
        db.run(`
        create table maze (
            id integer primary key autoincrement,
            userId integer,
            name text not null,
            description text,
            image text not null,
            createdAt date,
            createdByIp text,
            foreign key (userId)
                references user (id)
            )`, (error) => {
                if (error) return

                console.log('Successfully created maze table')
            })
    })
}