export function createElementFromHTML(htmlString) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    
    return div.firstElementChild
}

export function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function downloadData(dataUrl, nameFile = '') {
    const link = document.createElement('a')
    link.setAttribute('hidden', '')
    document.body.appendChild(link)
    link.setAttribute('href', dataUrl)
    link.setAttribute('download', nameFile)
    link.click()
    link.remove()
}

export function checkToken(auth) {
    if (!auth) return false

    const currentDate = new Date()
    const createAt = new Date(auth.createAt)
    createAt.setSeconds(createAt.getSeconds() + parseInt(auth.expires_in))
    
    if (currentDate < createAt) return true
    else return false
}

export function navigateTo(routeName) {
    const anchorRoute = document.querySelector('#anchorRoute')
    anchorRoute.setAttribute('href', routeName)
    anchorRoute.click()
    anchorRoute.setAttribute('href', '')
}

export function priorityInput(event) {
    event.stopPropagation()
}

import classesForms from '../assets/styles/forms_controls.module.scss'

const TIME_SHOWING_MESSAGE = 1000
const MINIMUM_TIME_WAIT = 1000

export function submitButtonHandler(target, callbackPromise, callbackSuccess, callbackError) {
    const targetClass = target.classList
    if (targetClass.contains(classesForms['button__submit--active']) || targetClass.contains(classesForms['button__submit--done']) || targetClass.contains(classesForms['button__submit--error'])) return

    targetClass.add(classesForms['button__submit--active'])
    Promise.all([
        new Promise(async (resolve, reject) => {
            await callbackPromise(resolve, reject)
        }), 
    new Promise(resolve => setTimeout(resolve, MINIMUM_TIME_WAIT))
    ]).then(() => {
        targetClass.remove(classesForms['button__submit--active'])
        targetClass.add(classesForms['button__submit--done'])

        setTimeout(() => {
            targetClass.remove(classesForms['button__submit--done'])

            if (callbackSuccess) callbackSuccess()
        }, TIME_SHOWING_MESSAGE)
    }).catch(() => {
        targetClass.remove(classesForms['button__submit--active'])
        targetClass.add(classesForms['button__submit--error'])

        setTimeout(() => {
            targetClass.remove(classesForms['button__submit--error'])

            if (callbackError) callbackError()
        }, TIME_SHOWING_MESSAGE)
    })
}