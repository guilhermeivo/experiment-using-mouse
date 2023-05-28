import { optionsSelect } from "../../db/sqlite";

export interface IRead<T> {
    find(options: optionsSelect): Promise<Array<T>>
    findById(id: number): Promise<T>
    findAndCount(options: optionsSelect): Promise<{ count: number, model: Array<T> }>
    findOne(options: optionsSelect): Promise<T>
    pagination(pageSize: number, pageNumber: number, options: optionsSelect): Promise<Array<T>>
}