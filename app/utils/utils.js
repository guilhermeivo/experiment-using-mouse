/**
 * 
 * @param string htmlString 
 * @returns object
 */
export function createElementFromHTML(htmlString) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    
    return div.firstChild
}