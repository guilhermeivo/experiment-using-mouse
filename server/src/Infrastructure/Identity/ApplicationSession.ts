import BaseEntity from "@Domain/Common/BaseEntity"

export default interface Session extends BaseEntity {
    token: string
    createdOn: Date
    createdByIp: string
    revokedOn: Date
    revokedByIp: string
}