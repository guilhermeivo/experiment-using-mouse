import { createElementFromHTML } from '../../Common/common'

import classes from './style.module.scss'

export default customElements.define('maze-edit',
    class extends HTMLElement {

        constructor(...props) {
            super(props)
            
            this.state = {
                editable: this.hasAttribute('editable') || true,

                overwolrdMazeEdit: null
            }
        }

        connectedCallback() {       
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        createColumnHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = this.state.overwolrdMazeEdit.columns + 1
            this.state.overwolrdMazeEdit.columns = newValue
            if (newValue != this.state.overwolrdMazeEdit.columns) return

            this.update()
        }

        removeColumnHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = this.state.overwolrdMazeEdit.columns - 1
            this.state.overwolrdMazeEdit.columns = newValue
            if (newValue != this.state.overwolrdMazeEdit.columns) return

            this.update()
        }

        createRowHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = this.state.overwolrdMazeEdit.rows + 1
            this.state.overwolrdMazeEdit.rows = newValue
            if (newValue != this.state.overwolrdMazeEdit.rows) return

            this.update()
        }

        removeRowHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = this.state.overwolrdMazeEdit.rows - 1
            this.state.overwolrdMazeEdit.rows = newValue
            if (newValue != this.state.overwolrdMazeEdit.rows) return

            this.update()
        }

        #createBlock({ x, y }) {
            const block = document.createElement('maze-block')
            block.classList.add(classes['maze__block'])

            this.state.overwolrdMazeEdit.add({ x, y })
            block.setAttribute('type', this.state.overwolrdMazeEdit.getTile({ x, y }))
            block.setAttribute('position', `${x},${y}`)
            block.state.type = this.state.overwolrdMazeEdit.getTile({ x, y })
            block.state.position = `${x},${y}`
            
            return block
        }

        #createMaze() {
            return (`<div class="${ classes['maze'] }">${
                (() => {
                    const lines = []
                    for (let i = 0; i < this.state.overwolrdMazeEdit.rows; i++) {
                        lines.push(`<div class="${ classes['line'] }">${
                            (() => {
                                const blocks = []

                                for (let j = 0; j < this.state.overwolrdMazeEdit.columns; j++) {
                                    blocks.push(`<maze-block 
                                        class="${ classes['maze__block'] }" 
                                        type="${ this.state.overwolrdMazeEdit.getTile({ x: i + 1, y: j + 1 }) }"
                                        position="${ `${i+1},${j+1}` }"></maze-block>`)
                                }

                                return blocks.join('')
                            })()
                        }</div>`)
                    }
                    return lines.join('')
                })()
            }</div>`)
        }

        render() {
            this.append(createElementFromHTML(this.#createMaze()))
            this.update()
        }

        update() {
            const maze = this.querySelector(`.${ classes['maze'] }`)
            const remainingLines = this.state.overwolrdMazeEdit.rows - maze.children.length

            // add - rows
            for (let i = 0; i < remainingLines; i++) {
                const line = document.createElement('div')
                line.classList.add(classes['line'])
                maze.append(line)

                for (let j = 0; j < this.state.overwolrdMazeEdit.columns; j++) {
                    line.append(this.#createBlock({ x: maze.children.length, y: j + 1 }))
                }
            }

            // remove - rows
            if (remainingLines < 0) {
                for (let i = 0; i < this.state.overwolrdMazeEdit.columns; i++) {
                    this.state.overwolrdMazeEdit.remove({ x: maze.children.length, y: i + 1 })
                }
                maze.lastChild.remove()
            }

            // add - columns
            const remainingColumns = this.state.overwolrdMazeEdit.columns - maze.children[0].children.length

            for (let i = 0; i < remainingColumns; i++) {
                Array.from(maze.children).forEach((line, key) => {
                    console.log()
                    line.append(this.#createBlock({ x: key + 1, y: maze.children[key].children.length + 1 }))
                })
            }

            // remove - columns
            if (remainingColumns < 0) {
                for (let i = 0; i < this.state.overwolrdMazeEdit.rows; i++) {
                    this.state.overwolrdMazeEdit.remove({ x: i + 1, y: maze.children[i].children.length })
                    maze.children[i].lastChild.remove()
                }
            }
        }
    })