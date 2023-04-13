export function createElementFromHTML(htmlString) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    
    return div.firstChild
}

export function getAroundBlocks(blocks, position) {
    const positionNumber = position.split(',').map(positionString => Number(positionString))
    const indexValuesX = [0, -1, +1, 0]
    const indexValuesY = [-1, 0, 0, +1]

    let blocksAround = []

    for (let i = 0; i < 4; i++) {
        const radialPositions = [positionNumber[0] + indexValuesX[i], positionNumber[1] + indexValuesY[i]].join(',')
        const radialPositionBlock = blocks.find(block => block.position === radialPositions)

        if (radialPositionBlock)
            blocksAround.push(radialPositionBlock)
        else 
            blocksAround.push(null)
    }

    return blocksAround
}

export function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function exportEncodedStringMaze(blocks) {
    if (!blocks) throw new Error('Missing blocks.')

    const encodedString = blocks.map(block => {
        return `${ block.position }-${ block.type }`
    }).join(';')
    
    return encodedString
}

export function importEncodedStringMaze(encodedString) {
    if (!encodedString) throw new Error('Missing encodedString.')

    const blocks = []
    encodedString.split(';').map(block => {
        blocks.push({ id: uid(), type: block.split('-')[1], position: block.split('-')[0] })
    })
    
    return blocks
}