export default class TransitionPages {
    constructor(element, config) {
        this.element = element
    }

    transitionLeft() {
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

    transitionRight() {
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