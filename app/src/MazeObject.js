import { uid } from "./Common/common"

export default class MazeObject {
    constructor(config) {
        this.id = config.id || uid()
        this.isMount = false
        this.x = config.x || 0
        this.y = config.y || 0
    }

    mount(map) {
        this.isMounted = true
        map.addWall(this.x, this.y)
    }
}