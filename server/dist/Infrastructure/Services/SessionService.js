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
class SessionService {
    static CreateTokenSession() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
                var r = Math.random() * 16 | 0, v = char == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            try {
                const result = yield new Promise((resolve, reject) => {
                    const sqlInsert = `insert into session (token)
                    values ('${token}')`;
                    connection_1._context.serialize(() => {
                        return connection_1._context.run(sqlInsert, function (error) {
                            if (error) {
                                console.error(error.message);
                                return reject(error.message);
                            }
                            return resolve(this.lastID.toString());
                        });
                    });
                });
                return token;
            }
            catch (exception) {
                return '';
            }
        });
    }
    static ValidateTokenSession(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield new Promise((resolve, reject) => {
                    const sqlSelect = `select token from session
                    where session.token = '${token}'`;
                    connection_1._context.serialize(() => {
                        return connection_1._context.all(sqlSelect, function (error, rows) {
                            if (error) {
                                console.error(error.message);
                                return reject(error.message);
                            }
                            return resolve(rows.length > 0 ? true : false);
                        });
                    });
                });
            }
            catch (exception) {
                return false;
            }
        });
    }
}
exports.default = SessionService;
//# sourceMappingURL=SessionService.js.map