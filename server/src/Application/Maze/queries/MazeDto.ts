import BaseEntity from "@Domain/Common/BaseEntity"

export default interface Maze extends BaseEntity {
    name: string
    like?: string
    view?: string
    isLiked?: boolean
    description?: string
    createdOn?: string
    base64image: string
}