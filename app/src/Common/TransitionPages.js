export default class TransitionPages {
    constructor(element, config) {
        this.element = element
    }

    transitionWipeLeft() {
        return new Promise(resolve => {
            const transition = document.querySelector('.transitionAnimation')
            transition.classList.toggle('transitionAnimation--left')
            setTimeout(() => {
                transition.classList.toggle('transitionAnimation--left')
            }, 1150)
            setTimeout(() => {
                resolve()
            }, 725)
        })
    }

    transitionWipeRight() {
        return new Promise(resolve => {
            const transition = document.querySelector('.transitionAnimation')
            transition.classList.toggle('transitionAnimation--right')
            setTimeout(() => {
                transition.classList.toggle('transitionAnimation--right')
            }, 1150)
            setTimeout(() => {
                resolve()
            }, 725)
        })
    }
}