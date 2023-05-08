import entityBase from "../common/interfaces/entityBase"

export default interface interaction extends entityBase {
    userId?: number
    mazeId?: number
    type: string
}