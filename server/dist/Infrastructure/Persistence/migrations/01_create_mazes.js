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
const connection_1 = require("@Infrastructure/Persistence/connection");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const context = yield (0, connection_1.openConnection)();
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
});
//# sourceMappingURL=01_create_mazes.js.map