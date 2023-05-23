import { nextPosition, withGrid } from "./Common/common"
import Person from './Person'
import MazeObject from "./MazeObject"
import { Cheese } from "./Cheese"
import OverworldEvent from './OverworldEvent'

export default class OverworldMap {
    constructor(config) {
        this.overworld = null
        this.configObjects = config.configObjects
        this.gameObjects = { }
        this.tiles = config.tiles || { }

        this.lowerImageSrc = config.lowerSrc
    }

    initializeLowerImage() {
        if (this.isLoaded) return
        
        this.lowerImage = new Image()
        this.lowerImage.crossOrigin = 'Anonymous'
        this.lowerImage.src = this.lowerImageSrc
        
        this.lowerImage.onload = () => {
            this.isLoaded = true
            return
        }
        this.lowerImage.onerror = event => { 
            return
        }
    }

    drawLowerImage(ctx, cameraPerson) {
        this.initializeLowerImage()
        
        this.isLoaded && ctx.drawImage(
            this.lowerImage, 
            withGrid(9) - cameraPerson.x, 
            withGrid(4) - cameraPerson.y)
    }

    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = nextPosition(currentX, currentY, direction)

        if (this.tiles[`${x},${y}`] === 'wall') {
            return true
        }
        return Object.values(this.gameObjects).find(obj => {
            if (obj.x === x && obj.y === y) { return true; }
            if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y) {
                return true
            }
            return false
        })
    }

    mountObjects() {
        Object.keys(this.configObjects).forEach(key => {
            let config = this.configObjects[key]
            config.id = key
      
            let obj
            if (config.type === 'Person') {
              obj = new Person(config)
            }
            if (config.type === 'Object') {
              obj = new MazeObject(config)
            }
            if (config.type === 'Cheese') {
              obj = new Cheese(config)
            }
            this.gameObjects[key] = obj
            this.gameObjects[key].id = key
            obj.mount(this)
        })
    }

    async startEvent(events) {
        for (let i=0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            const result = await eventHandler.initialize()
        }
    }

    checkForActionCutscene() {
        const hero = this.gameObjects['hero'] || this.gameObjects['mouse']
        const nextCoords = nextPosition(hero.x, hero.y, hero.direction)
        const match = Object.values(this.gameObjects).find(object => {
          return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        })
        if (match && match.events.length) {
            this.startEvent(match.events)
        }
    }
}