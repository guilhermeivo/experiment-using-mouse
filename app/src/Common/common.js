export function createElementFromHTML(htmlString) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    
    return div.firstChild
}

export function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function downloadData(dataUrl, nameFile = '') {
    const link = document.createElement('a')
    link.style.display = 'none'
    document.body.appendChild(link)
    link.setAttribute('href', dataUrl)
    link.setAttribute('download', nameFile)
    link.click()
}

export function checkToken(auth) {
    if (!auth) return false

    const currentDate = new Date()
    const createAt = new Date(auth.createAt)
    createAt.setSeconds(createAt.getSeconds() + parseInt(auth.expires_in))
    
    if (currentDate < createAt) return true
    else return false
}