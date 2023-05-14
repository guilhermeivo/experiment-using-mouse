import entityBase from "../common/interfaces/entityBase"

export default interface file extends entityBase {
    fileName: string
    contentType: string
    filePath: string
    size: number
    createdAt?: Date
    createdByIp?: string
    updatedAt?: Date
    updatedByIp?: string
}