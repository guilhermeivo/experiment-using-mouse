const mazeSolver = require('./mazeSolver.js')

class Validators {
    static isEmail = (value) => {        
        const emailRegExp = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/

        const isValid = value.length > 0 && 
            emailRegExp.test(value)

        return isValid
    }

    static isNotEmpty = (value) => {
        const isValid = value.length > 0

        return isValid
    }

    static isNotSpecialCharacters = (value) => {
        const nonAlphanumericCharactersRegExp = /(\W)|(_)/
        const numbersRegExp = /([0-9])/

        const isValid = value.length > 0 &&
            !nonAlphanumericCharactersRegExp.test(value) &&
            !numbersRegExp.test(value)

        return isValid
    }

    static isPossibleMaze = (maze) => {
        const mazeSimplify = []
        for (let x = 1; x <= maze.rows; x++) {
            const line = []
            for (let y = 1; y <= maze.columns; y++) {
                const tile = maze.tiles[`${x},${y}`]
                if (tile === 'wall') line.push(-1)
                else line.push(0)
            }
            mazeSimplify.push(line)
        }

        return mazeSolver({
            x: maze.configObjects.cheese.y,
            y: maze.configObjects.cheese.x
        }, {
            x: maze.configObjects.mouse.y,
            y: maze.configObjects.mouse.x
        }, mazeSimplify)
    }
}

Validators.version = '__VERSION__'

module.exports = Validators