import { uid } from "./Common/common"
import SpriteObject from './SpriteObject'

export default class MazeObject {
    constructor(config) {
        this.id = config.id || uid()
        this.isMount = false
        this.x = config.x || 0
        this.y = config.y || 0
        this.direction = config.direction || 'down'
        if (config.src) {
            this.sprite = new SpriteObject({
                gameObject: this,
                src: config.src || ''
            })
        }        
        this.events = config.events || []
    }

    mount(map) {
        this.isMounted = true
    }

    update() {
    }
}