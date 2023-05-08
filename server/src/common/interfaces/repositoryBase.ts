export default interface genericRepository<T extends object> {
    [key: string]: any

    Add(entity: T): Promise<T>
    Find(): Promise<Array<T | any>>
    Where(callbackWhere: Function): Promise<Array<T | any>>
    Remove(callbackWhere: Function): any
    Update(newEntity: any, callbackWhere: Function): any
    Count(callbackWhere: Function): Promise<string>
}