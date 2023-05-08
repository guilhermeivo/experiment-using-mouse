import entityBase from "../common/interfaces/entityBase"

export default interface token extends entityBase {
    userId?: number,
    token: string,
    expirationTime: Date,
    createdAt?: Date,
    createdByIp?: string
    revokedAt?: Date,
    revokedByIp?: string
    type?: string
}