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