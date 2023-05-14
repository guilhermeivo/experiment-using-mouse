import MazeObject from './MazeObject'
import SpriteObject from './SpriteObject'

export class Cheese extends MazeObject {
    constructor(config) {
        super(config)
        this.sprite = new SpriteObject({
            gameObject: this,
            src: config.src,
            animations: {
            'used-down'   : [ [0,0] ],
            'unused-down' : [ [1,0] ],
            },
            currentAnimation: 'used-down'
        })
        this.flag = 'eating-cheese'
  
        this.events = [
            { type: 'textMessage', text: 'Cheese was successfully found!' },
            { type: 'addFlag', flag: this.flag }
        ]
    }
  
    update() {
        this.sprite.currentAnimation = !state.flags[this.flag]
        ? 'used-down'
        : 'unused-down'
    }
  
}