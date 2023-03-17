export function createElementFromHTML(htmlString) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    
    return div.firstChild
}

export function getDirectoryAssetsPath(file, typeFile) {
    let extension = ''
    switch (typeFile) {
        case 'image':
            extension = '.png'
            break;
        case 'audio':
            extension = '.mp3'
            break;
        default:
            extension = '.png'
            break;
    }

    const directorPath = window.location.origin + '/app/assets/' + file + extension
    
    return directorPath
}