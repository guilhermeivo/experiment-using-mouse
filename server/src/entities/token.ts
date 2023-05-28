import IEntityBase from "../common/interfaces/IEntityBase"

export default interface token extends IEntityBase {
    userId?: number,
    token: string,
    expirationTime: Date,
    createdAt?: Date,
    createdByIp?: string
    revokedAt?: Date,
    revokedByIp?: string
    type?: string
}