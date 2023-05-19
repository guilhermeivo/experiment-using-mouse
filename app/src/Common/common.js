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

export function checkToken() {
    const authToken = JSON.parse(localStorage.getItem('auth'))
    
    if (!authToken) return false

    const currentDate = new Date()
    const createAt = new Date(authToken.createAt)
    createAt.setSeconds(createAt.getSeconds() + parseInt(authToken.expires_in))
    
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

export function withGrid(n) {
    return n * 32
}
  
export function asGridCoord(x,y) {
    return `${x*32},${y*32}`
}
  
export function nextPosition(initialX, initialY, direction) {
    let x = initialX
    let y = initialY
    const size = 32
    if (direction === "left") { 
        x -= size
    } else if (direction === "right") {
        x += size
    } else if (direction === "up") {
        y -= size
    } else if (direction === "down") {
        y += size
    }
    return {x,y}
}

export function enableBackMenu() {
    const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
    if (backMenu.classList.contains('back-menu--disabled')) 
        backMenu.classList.remove('back-menu--disabled')
}

export function disableBackMenu() {
    const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
    if (!backMenu.classList.contains('back-menu--disabled')) 
        backMenu.classList.add('back-menu--disabled')
}

HTMLElement.prototype.appendDOM = function(stringHtml, position = 'beforeend') {
    this.insertAdjacentHTML(position, stringHtml.trim())
    return this
}

Window.prototype.getParameterUrl = function(key) {
    const urlParams = new URLSearchParams(window.location.search)
    const param = urlParams.get(key)
    return param
}