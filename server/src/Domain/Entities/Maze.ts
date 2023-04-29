import BaseEntity from "@Domain/Common/BaseEntity"

export default interface Maze extends BaseEntity {
    sessionId: string
    name: string
    description?: string
    createdOn?: string
    base64image: string
}