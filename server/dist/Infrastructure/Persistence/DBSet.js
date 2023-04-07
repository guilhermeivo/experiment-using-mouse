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
function DBSet(tableName) {
    const Find = () => __awaiter(this, void 0, void 0, function* () {
        const sqlSelect = `select * from ${tableName}`;
        const result = yield new Promise((resolve, reject) => {
            Connection_1._context.serialize(() => {
                return Connection_1._context.all(sqlSelect, (error, rows) => {
                    if (error) {
                        console.error(error.message);
                        return reject(error.message);
                    }
                    return resolve(rows);
                });
            });
        });
        return result;
    });
    const Add = (entity) => __awaiter(this, void 0, void 0, function* () {
        const valuesName = Object.keys(entity).map((key, index) => {
            if (entity[key])
                return (key);
        }).filter(Boolean).join(', ');
        const values = Object.keys(entity).map((key, index) => {
            if (entity[key] && typeof entity[key] === 'string')
                return `'${entity[key]}'`;
            else
                return entity[key];
        }).filter(Boolean).join(', ');
        const sqlInsert = `insert into ${tableName} (${valuesName}) values (${values})`;
        return yield new Promise((resolve, reject) => {
            Connection_1._context.serialize(() => {
                return Connection_1._context.run(sqlInsert, function (error) {
                    if (error) {
                        console.error(error.message);
                        return reject(error.message);
                    }
                    return resolve(this.lastID.toString());
                });
            });
        });
    });
    const Where = (callbackWhere) => __awaiter(this, void 0, void 0, function* () {
        const entity = yield Find();
        return entity.map((entity) => callbackWhere(entity) && entity).filter(Boolean);
    });
    const Update = (newEntity, callbackWhere) => __awaiter(this, void 0, void 0, function* () {
        const entity = [...yield Where(callbackWhere)][0];
        Object.keys(entity).map((key, index) => {
            if (entity[key] === newEntity[key])
                delete newEntity[key];
        });
        const valuesName = Object.keys(newEntity).map((key, index) => {
            if (newEntity[key])
                return (key);
        }).filter(Boolean);
        const values = Object.keys(newEntity).map((key, index) => {
            if (newEntity[key] && typeof newEntity[key] === 'string')
                return `'${newEntity[key]}'`;
            else
                return newEntity[key];
        }).filter(Boolean);
        const setValues = Object.keys(newEntity).map((key, index) => `${valuesName[index]} = ${values[index]}`).filter(Boolean).join(', ');
        const sqlUpdate = `update ${tableName} set ${setValues} where ${tableName}.rowid = '${entity.id}'`;
        yield new Promise((resolve, reject) => {
            Connection_1._context.serialize(() => {
                return Connection_1._context.run(sqlUpdate, function (error) {
                    if (error) {
                        console.error(error.message);
                        return reject(error.message);
                    }
                    return resolve('');
                });
            });
        });
    });
    return ({
        Find: () => Find(),
        Where: (callback) => Where(callback),
        Add: (entity) => Add(entity),
        Remove: () => { },
        Update: (entity, callback) => Update(entity, callback)
    });
}
exports.default = DBSet;
//# sourceMappingURL=DBSet.js.map