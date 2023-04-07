import BaseEntity from "@Domain/Common/BaseEntity"

export default interface Session extends BaseEntity {
    token: string
    createdOn: string
    createdByIp: string
    revokedOn: string
    revokedByIp: string
}