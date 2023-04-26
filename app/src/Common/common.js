export function createElementFromHTML(htmlString) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    
    return div.firstChild
}

export function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}