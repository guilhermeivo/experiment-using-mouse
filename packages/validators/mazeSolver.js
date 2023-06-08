/*
* Ajude um rato a encontrar um pedaco de queijo num labirinto
* como o do desenho abaixo:
* Um labirinto desses pode ser representado por uma matriz
* retangular L, cujo elemento l_(i, j) vale 0 ou -1 conforme a 
* casa correspondente do labirinto seja uma passagem livre ou uma
* parede, respestivamente. Um metodo geral para resolver esse 
* problema consiste em marcar com o numero k (k = 1, 2, ...) 
* todas as casas livres que estejam a exatamente k - 1 passos de
* distancia do queijo, pelo caminho mais curto possivel. Suponha 
* que, a cada passo, o rato possa se deslocar de apenas uma casa 
* na vertical ou na horizontal. Entao, rotula-se inicialmente a 
* posicao do queijo com 1 e para cada k >= 2 examinam-se todas as
* casas livres do labirinto, marcando-se com k aquelas ainda nao
* marcadas e que sejam adjacentes a alguma casa marcada com k - 1.
* A marcacao continua ate ser atingido um valor de k (28 no 
* exemplo abaixo) tal que nenhuma casa esteja em condicoes de ser 
* marcada. Ao final da marcacao teremos a seguinte matriz, supondo 
* o queijo em (5,10):
* 26 27 -1 -1 12 11 10  9 10 11 12
* 25 -1  0  0 -1 12 -1  8 -1 -1 13
* 24 25 -1  0 -1 13 -1  7  6  5 -1
* 23 -1 21 -1 15 14 15 -1 -1  4  3
* 22 21 20 -1 16 -1 16 17 18 -1  2
* 23 -1 19 18 17 18 17 18 -1  2  1
* O caminho mais curto ate o queijo pode entao ser determinado, 
* partindo-se da posicao do rato e passando a cada etapa para uma
* casa adjacente cuja numeracao seja menor do que a atual.
* Por exemplo, partindo de [0, 0] o rato precisara percorrer pelo
* menos 26 casas para chegar ao queijo: [0, 0], [1, 0], [2, 0], 
* [3, 0], [4, 0], [4, 1], [4, 2], ..., [4, 10], [5, 10].
* Dados o labirinto (matriz L com elementos 0 e -1) e as posicoes
* do rato e do queijo, determine o caminho mais curto que o rato 
* deve percorrer ate encontrar o queijo, se tal caminho existir.
* Sugestao: Escreva uma funcao que efetua a marcacao (recebendo
* como parametros a matriz L, suas dimensoes e a posicao do 
* queijo) e um outro que imprime o caminho (recebendo como 
* parametros a matriz L ja marcada, suas dimensoes e a posicao
* inicial do rato)
*/
function mazeSolver(startPosition, finalPosition, maze) {
    if (!startPosition || !finalPosition || !maze) throw new Error('Not all values were passed')

    const amountLines = maze.length - 1
    const amountColumns = maze[0].length - 1
    const maximumAttempts = (amountLines * amountColumns) * (amountLines * amountColumns)
    const verticalIndex = [ 1, 0, 0, -1 ]
    const horizontalIndex = [ 0, -1, 1, 0 ]
    let itFound = false
    let attempts = 0

    maze[startPosition.y][startPosition.x] = 1

    // if (!surroundedbyWall(amountLines, amountColumns, maze)) return itFound 

    while (!itFound && attempts < maximumAttempts) {
        maze.forEach((lineItem, lineIndex) => {
            lineItem.forEach((columnItem, columnIndex) => {
                if (columnItem === 0 || columnItem === -1) return
                if (maze[finalPosition.y][finalPosition.x] != 0) {
                    itFound = true
                    return
                }

                let k = 0
                while (k < 4) {
                    const line = verticalIndex[k] + lineIndex
                    const column = horizontalIndex[k] + columnIndex
                    if (isValidPosition(amountLines, amountColumns, line, column) && maze[line][column] === 0)
                        maze[line][column] = columnItem + 1
                    k++
                }
            })
        })
        attempts++
    }

    return itFound
}

function isValidPosition(amountLines, amountColumns, line, column) {
    return line >= 0 && line <= amountLines && column >= 0 && column <= amountColumns
}

function surroundedbyWall(amountLines, amountColumns, maze) {
    let isValid = true

    for (let i = 0; i < amountLines; i++) {
        if (maze[i][0] > -1 || maze[i][amountColumns] > -1) isValid = false
    }

    for (let j = 0; j < amountColumns; j++) {
        if (maze[0][j] > -1 || maze[amountLines][j] > -1) isValid = false
    }

    return isValid
}

module.exports = mazeSolver