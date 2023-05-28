import IEntityBase from "../common/interfaces/IEntityBase"

export default interface file extends IEntityBase {
    fileName: string
    contentType: string
    filePath: string
    size: number
    createdAt?: Date
    createdByIp?: string
    updatedAt?: Date
    updatedByIp?: string
}