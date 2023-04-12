import { uid } from './common'

export default class Sprite {

    constructor(config) {
        this.id = uid()
        this.sprites = config.sprites || { }
        this.imageSrc = config.src
        this.gridDimension = config.gridDimension || 32
    }

    initialize() {
        if (this.initialized) return
        this.initialized = true

        return new Promise((resolve, reject) => {
            this.image = new Image()
            this.image.crossOrigin = 'Anonymous'
            this.image.src = this.imageSrc
            this.image.onload = () => {
                this.isLoaded = true
                resolve()
            }
            this.image.onerror = event => {
                reject(event)
            }
        })
    }

    drawImage(typeImage) {
        const canvas = document.createElement('canvas')
        canvas.width = this.gridDimension
        canvas.height = this.gridDimension
        const ctx = canvas.getContext("2d")

        let sx = this.sprites[typeImage][0], sy = this.sprites[typeImage][1]

        if (typeof this.sprites[typeImage][0] == 'object') {
            const number = Math.floor(Math.random() * this.sprites[typeImage].length)
           
            sx = this.sprites[typeImage][number][0]
            sy = this.sprites[typeImage][number][1]
        }

        this.isLoaded && ctx.drawImage(
            this.image, // image
            sx * this.gridDimension, sy * this.gridDimension, // sx, sy
            this.gridDimension, this.gridDimension, // sWidth, sHeight
            0, 0, // dx, dy
            this.gridDimension, this.gridDimension) // dWidth, dHeight

        return this.#convertCanvasToImage(canvas)
    }

    #convertCanvasToImage(canvas) {
        let image = new Image()
        image.src = canvas.toDataURL('image/jpeg', 1.0)
        return image
    }
}