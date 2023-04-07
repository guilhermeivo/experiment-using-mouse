import BaseEntity from "@Domain/Common/BaseEntity"
import BaseRevokedEntity from "@Domain/Common/BaseRevokedEntity"

export default interface Session extends BaseEntity, BaseRevokedEntity {
    token: string
}