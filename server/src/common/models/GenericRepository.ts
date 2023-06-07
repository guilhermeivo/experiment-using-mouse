import db from "../../persistence"
import { optionsDelete, optionsSelect, optionsUpdate } from "../../persistence/sqlite"
import { IRead } from "../interfaces/IRead"
import { IWrite } from "../interfaces/IWrite"

export default abstract class GenericRepository<T extends object> implements IWrite<T>, IRead<T> {
    table
    db
    constructor(table: string) {
        this.table = table
        this.db = db
    }

    async add(entity: T): Promise<T> {
        return this.db.add<T>(this.table, entity)
    }

    async destroy(options: optionsDelete = { }) {
        return this.db.destroy<T>(this.table, options)
    }

    async update(entity: object, options: optionsUpdate = { }) {
        return this.db.update<T>(this.table, entity, options)
    }

    async find(options: optionsSelect = { }) {
        return this.db.findAll<T>(this.table, options)
    }

    async findById(id: number) {
        return [...await this.find({
            where: {
                id: id
            }
        })][0]
    }

    async findAndCount(options: optionsSelect = { }) {
        const model = await this.find(options)

        return { count: model.length, model }
    }

    async findOne(options: optionsSelect = { }) {
        return [...await this.find(options)][0]
    }

    async pagination(pageSize: number, pageNumber: number, options: optionsSelect = { }) {
        return this.find({
            ...options,
            limit: [ pageSize, (pageNumber - 1) * pageSize ]
        })
    }
}