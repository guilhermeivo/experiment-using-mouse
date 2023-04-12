export default class CustomCursor {
    constructor(element, config) {
        this.element = element
        this.disableClass = config.disableClass
        this.initializedClass = config.initializedClass
        this.focusElements = config.focusElements
        this.focusClass = config.focusClass

        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
    }

    initialize() {
        if (!document.querySelector(this.element)) throw new Error(`Need to create element (${ this.element }).`)

        const customCursor = document.querySelector(this.element)
        customCursor.classList.add(this.initializedClass)
        document.addEventListener('mousemove', this.onMouseMove)
    }

    onMouseMove(event) {
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

    onMouseEnter(event) {
        const customCursor = document.querySelector(this.element)
        if (!customCursor.classList.contains(this.focusClass))
            customCursor.classList.add(this.focusClass)
    }

    onMouseLeave(event) {
        const customCursor = document.querySelector(this.element)
        if (customCursor.classList.contains(this.focusClass))
            customCursor.classList.remove(this.focusClass)
    }

    enable() {
        const customCursor = document.querySelector(this.element)
        if (customCursor.classList.contains(this.disableClass))
            document.addEventListener('mousemove', this.onMouseMove)

        document.querySelectorAll(...this.focusElements).forEach(element => {
            element.addEventListener('mouseenter', this.onMouseEnter)
            element.addEventListener('mouseleave', this.onMouseLeave)
        })
    }

    disable() {
        const customCursor = document.querySelector(this.element)
        if (!customCursor.classList.contains(this.disableClass)) {
            document.removeEventListener('mousemove', this.onMouseMove)
            customCursor.classList.add(this.disableClass)
        }

        document.querySelectorAll(...this.focusElements).forEach(element => {
            element.removeEventListener('mouseenter', this.onMouseEnter)
            element.removeEventListener('mouseleave', this.onMouseLeave)
        })
    }

    remove() {
        document.removeEventListener('mousemove', this.onMouseMove)

        document.querySelectorAll(...this.focusElements).forEach(element => {
            element.removeEventListener('mouseenter', this.onMouseEnter)
            element.removeEventListener('mouseleave', this.onMouseLeave)
        })
    }
}