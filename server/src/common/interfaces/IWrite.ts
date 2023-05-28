import { optionsDelete, optionsUpdate } from "../../db/sqlite"

export interface IWrite<T> {
    add(entity: T): Promise<T>
    update(entity: T, options: optionsUpdate): Promise<T>
    destroy(options: optionsDelete): Promise<T>
}