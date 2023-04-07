import BaseEntity from "@Domain/Common/BaseEntity"

export default interface Maze extends BaseEntity {
    sessionId: string
    mazeId: string
    type: string
}