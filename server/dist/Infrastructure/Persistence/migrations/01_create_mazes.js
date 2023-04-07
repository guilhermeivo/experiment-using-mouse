"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = require("@Infrastructure/Persistence/Connection");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const sqlCreate = `
    create table if not exists mazes (
        id integer primary key autoincrement,
        sessionId intenger,
        name string not null,
        likes integer,
        views integer,
        description string,
        createdByIp string,
        encodedString string not null,
        foreign key (sessionId)
            references session (id)
    )`;
    const sqlSelect = `select * from mazes`;
    Connection_1._context.serialize(() => {
        Connection_1._context.run(sqlCreate, (error) => {
            if (error) {
                return console.error(error.message);
            }
        });
    });
    Connection_1._context.serialize(() => {
        Connection_1._context.get(sqlSelect, (error, row) => {
            if (error) {
                return console.error(error.message);
            }
            console.log('Successfully created Mazes table.');
        });
    });
});
//# sourceMappingURL=01_create_mazes.js.map