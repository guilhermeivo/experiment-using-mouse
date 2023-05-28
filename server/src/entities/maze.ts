import IEntityBase from "../common/interfaces/IEntityBase"

export default interface maze extends IEntityBase {
    userId?: number
    fileId?: number
    name: string
    description?: string
    createdAt?: Date
    createdByIp?: string
}