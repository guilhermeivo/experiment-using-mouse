export default class CustomCursor {
    constructor(element, config) {
        this.element = element
        this.disableClass = config.disableClass
        this.initializedClass = config.initializedClass
        this.focusElements = config.focusElements
        this.focusClass = config.focusClass

        this.handleMouseMove = this.handleMouseMove.bind(this)
    }

    initialize() {
        if (!document.querySelector(this.element)) throw new Error(`Need to create element (${ this.element }).`)

        const customCursor = document.querySelector(this.element)
        customCursor.classList.add(this.initializedClass)
        document.addEventListener('mousemove', this.handleMouseMove)

        document.querySelectorAll(...this.focusElements).forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (!customCursor.classList.contains(this.focusClass))
                    customCursor.classList.add(this.focusClass)
            })
            element.addEventListener('mouseleave', () => {
                if (customCursor.classList.contains(this.focusClass))
                    customCursor.classList.remove(this.focusClass)
            })
        })
    }

    handleMouseMove(event) {
        const customCursor = document.querySelector(this.element)
        customCursor.style.transform = `
            translate3d(
                calc(${ event.clientX }px - 50%), 
                calc(${ event.clientY }px - 50%), 
                0)
        `

        if (customCursor.classList.contains(this.disableClass))
            customCursor.classList.remove(this.disableClass)
    }

    enable() {
        const customCursor = document.querySelector(this.element)
        if (customCursor.classList.contains(this.disableClass))
            document.addEventListener('mousemove', this.handleMouseMove)
    }

    disable() {
        const customCursor = document.querySelector(this.element)
        if (!customCursor.classList.contains(this.disableClass)) {
            document.removeEventListener('mousemove', this.handleMouseMove)
            customCursor.classList.add(this.disableClass)
        }
    }
}