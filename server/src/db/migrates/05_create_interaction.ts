import db from "../connection"

export default () => {
    db.serialize(() => {
        db.run(`
        create table interaction (
            id integer primary key autoincrement,
            userId integer,
            mazeId integer,
            type text not null,
            foreign key (userId)
                references user (id)
            foreign key (mazeId)
                references maze (id)
            )`, (error) => {
                if (error) return

                console.log('Successfully created interaction table.')
            })
    })
}