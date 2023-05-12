const MINIMUM_TIME = 500

export default class TransitionPages {
    constructor(element, config) {
        this.element = element
    }

    wipeLeft(callbackPromise) {
        const transition = document.querySelector('.transitionAnimation')
        transition.classList.add('transitionAnimation--setLeft')
        transition.classList.add('transitionAnimation--moveToCenter')
        Promise.all([
            new Promise(resolve => {
                callbackPromise.then(() => resolve())
            }),
            new Promise(resolve => setTimeout(resolve, MINIMUM_TIME))
        ]).then(() => {
            transition.classList.remove('transitionAnimation--setLeft')
            transition.classList.remove('transitionAnimation--moveToCenter')
            transition.classList.add('transitionAnimation--moveToRight')
            setTimeout(() => {
                transition.classList.remove('transitionAnimation--moveToRight')
            }, 200)
        })
    }

    wipeRight(callbackPromise) {
        const transition = document.querySelector('.transitionAnimation')
        transition.classList.add('transitionAnimation--setRight')
        transition.classList.add('transitionAnimation--moveToCenter')
        Promise.all([
            new Promise(resolve => {
                callbackPromise.then(() => resolve())
            }),
            new Promise(resolve => setTimeout(resolve, MINIMUM_TIME))
        ]).then(() => {
            transition.classList.remove('transitionAnimation--setRight')
            transition.classList.remove('transitionAnimation--moveToCenter')
            transition.classList.add('transitionAnimation--moveToLeft')
            setTimeout(() => {
                transition.classList.remove('transitionAnimation--moveToLeft')
            }, 200)
        })
    }

    opacity() {
        return new Promise(resolve => {
            const transition = document.querySelector('.transitionAnimation')
            transition.classList.toggle('transitionAnimation--opacity')
            setTimeout(() => {
                transition.classList.toggle('transitionAnimation--opacity')
            }, 1000)
            setTimeout(() => {
                resolve()
            }, 300)
        })
    }
}