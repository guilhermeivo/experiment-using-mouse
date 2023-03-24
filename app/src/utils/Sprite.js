import { uid } from './utils'

const gridDimension = 32

export default class Sprite {

    constructor(config) {
        this.id = uid()
        this.sprites = config.sprites || { }
        this.imageSrc = config.src
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
            this.image.onerror = e => {
                reject(e)
            }
        })
    }

    drawImage(typeImage) {
        const canvas = document.createElement('canvas')
        canvas.width = gridDimension
        canvas.height = gridDimension
        const ctx = canvas.getContext("2d")

        let sx = this.sprites[typeImage][0], sy = this.sprites[typeImage][1]

        if (typeof this.sprites[typeImage][0] == 'object') {
            const number = Math.floor(Math.random() * this.sprites[typeImage].length)
           
            sx = this.sprites[typeImage][number][0]
            sy = this.sprites[typeImage][number][1]
        }

        this.isLoaded && ctx.drawImage(
            this.image, // image
            sx * gridDimension, sy * gridDimension, // sx, sy
            gridDimension, gridDimension, // sWidth, sHeight
            0, 0, // dx, dy
            gridDimension, gridDimension) // dWidth, dHeight

        return this.#convertCanvasToImage(canvas)
    }

    #convertCanvasToImage(canvas) {
        let image = new Image()
        image.src = canvas.toDataURL('image/jpeg', 1.0)
        return image
    }
}