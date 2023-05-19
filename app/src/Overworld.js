import OverworldMap from "./OverworldMap"
import DirectionInput from './DirectionInput'
import KeyPressListener from './KeyPressListener'
import './State'

export default class Overworld {
    constructor(config) {
        this.element = config.element
        this.canvas = this.element.querySelector('#game-canvas')
        this.ctx = this.canvas.getContext('2d')
        this.map = null
    }

    startGameLoop() {
        const step = () => {
            this.ctx.clearRect(
                0, 0, 
                this.canvas.width, this.canvas.height)

            const cameraPerson = this.map.gameObjects.hero || this.map.gameObjects.mouse

            this.map.drawLowerImage(this.ctx, cameraPerson)

            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                })
            })

            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y
            }).forEach(object => {
                object.sprite.draw(this.ctx, cameraPerson)
            })

            requestAnimationFrame(() => {
                step()
            })
        }
        step()
    }

    bindActionInput() {
        new KeyPressListener('Enter', () => {
          this.map.checkForActionCutscene()
        })
    }

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig)
        this.map.overworld = this
        this.map.mountObjects()
    }

    async initialize() {
        const width = this.element.clientWidth / 2
        const height = this.element.clientHeight / 2

        this.canvas.width = width
        this.canvas.height = height

        this.startMap(window.OverworldMaps['MazeMap'])

        this.directionInput = new DirectionInput()
        this.directionInput.init()

        this.bindActionInput()

        this.startGameLoop()
    }
}