import db from "../connection"

export default () => {
    db.serialize(() => {
        db.run(`
        create table file (
            id integer primary key autoincrement,
            fileName text not null,
            contentType text not null,
            filePath text not null,
            size integer not null,
            createdAt date,
            createdByIp text,
            updatedAt date,
            updatedByIp text
            )`, (error) => {
                if (error) return

                console.log('Successfully created file table')
            })
    })
}