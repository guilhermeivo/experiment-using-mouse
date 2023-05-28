import IEntityBase from "../common/interfaces/IEntityBase"

export default interface interaction extends IEntityBase {
    userId?: number
    mazeId?: number
    type: string
}