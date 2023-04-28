export default class Sprite {

    constructor(config) {
        this.variants = config.variants || { }
        this.imageSrc = config.src
        this.gridDimension = config.gridDimension || 32
    }

    initialize() {
        return new Promise((resolve, reject) => {
            if (this.isLoaded) resolve()
              
            this.image = new Image()
            this.image.crossOrigin = 'Anonymous'
            this.image.src = this.imageSrc

            this.image.onload = () => {
                this.isLoaded = true
                resolve()
            }     
            this.image.onerror = event => { 
                reject()
            }
        })
    }

    async drawImage(typeImage) {
        await this.initialize()

        const canvas = document.createElement('canvas')
        canvas.width = this.gridDimension
        canvas.height = this.gridDimension
        const ctx = canvas.getContext("2d")

        let sx = this.variants[typeImage][0], sy = this.variants[typeImage][1]

        if (typeof this.variants[typeImage][0] == 'object') {
            const number = Math.floor(Math.random() * this.variants[typeImage].length)
        
            sx = this.variants[typeImage][number][0]
            sy = this.variants[typeImage][number][1]
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
        image.src = canvas.toDataURL()
        return image
    }
}