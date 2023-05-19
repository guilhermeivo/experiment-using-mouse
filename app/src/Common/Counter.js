export default class Counter {
    constructor(config) {
        this.interval = config.interval || 1000
        this.timer = config.startsWith || 0
        this.onRender = config.callback
    }

    update() {
        if (this.onRender && typeof this.onRender === 'function') {
            this.onRender(this.getTime())
        }
    }

    getTime() {
        return {
            days: Math.floor(this.timer / 1000 / 60 / 60 / 24),
            hours: Math.floor(this.timer / 1000 / 60 / 60) % 24,
            minutes: Math.floor(this.timer / 1000 / 60) % 60,
            seconds: Math.floor(this.timer / 1000) % 60
        }
    }

    start() {
        this.update()
        this.intervalId = setInterval(() => {
            this.timer += this.interval
            this.update()
        }, this.interval)
    }

    finish() {
        clearInterval(this.intervalId)
    }
}