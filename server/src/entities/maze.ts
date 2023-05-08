import entityBase from "../common/interfaces/entityBase"

export default interface maze extends entityBase {
    userId?: number
    name: string
    description?: string
    image: string
    createdAt?: Date
    createdByIp?: string
}