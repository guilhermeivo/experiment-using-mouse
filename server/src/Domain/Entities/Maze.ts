import BaseEntity from "@Domain/Common/BaseEntity"

export default interface Maze extends BaseEntity {
    sessionId: string
    name: string
    likes?: number
    views?: number
    description?: string
    createdOn?: Date
    createdByIp?: string
    encodedString: string
}