"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("@Infrastructure/Persistence/connection");
exports.default = () => {
    const context = (0, connection_1.openConnection)();
    const sql = `
    create table if not exists mazes (
        id integer primary key autoincrement,
        name string,
        likes integer,
        views integer,
        description string,
        ipAdress string,
        encodedString string
    )`;
    context.serialize(() => {
        context.each(sql, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Successfully created');
        });
    });
    (0, connection_1.closeConnection)(context);
};
//# sourceMappingURL=01_create_mazes.js.map