import entityBase from "../common/interfaces/entityBase"

export default interface maze extends entityBase {
    userId?: number
    fileId?: number
    name: string
    description?: string
    createdAt?: Date
    createdByIp?: string
}