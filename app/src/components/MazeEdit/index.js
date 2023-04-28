import { createElementFromHTML } from '../../Common/common'

import classes from './style.module.scss'

export default customElements.define('maze-edit',
    class extends HTMLElement {

        constructor(...props) {
            super(props)
            
            this.onChangeVisibilityEdges = this.onChangeVisibilityEdges.bind(this)

            this.state = {
                editable: this.hasAttribute('editable') || true,
                containsEdges: this.hasAttribute('editable') || false,
                overworldMazeEdit: null
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

            const newValue = this.state.overworldMazeEdit.columns + 1
            this.state.overworldMazeEdit.columns = newValue
            if (newValue != this.state.overworldMazeEdit.columns) return

            this.update()
        }

        removeColumnHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = this.state.overworldMazeEdit.columns - 1
            this.state.overworldMazeEdit.columns = newValue
            if (newValue != this.state.overworldMazeEdit.columns) return

            this.update()
        }

        createRowHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = this.state.overworldMazeEdit.rows + 1
            this.state.overworldMazeEdit.rows = newValue
            if (newValue != this.state.overworldMazeEdit.rows) return

            this.update()
        }

        removeRowHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = this.state.overworldMazeEdit.rows - 1
            this.state.overworldMazeEdit.rows = newValue
            if (newValue != this.state.overworldMazeEdit.rows) return

            this.update()
        }

        onChangeVisibilityEdges(event) {
            this.state = { 
                ...this.state, 
                containsEdges: !this.state.containsEdges
            }
            Array.from(document.querySelectorAll(`.${ classes['maze__block'] }`)).map(block => {
                block.classList.toggle(classes['maze__block--not-edges'])
            })
        }

        exportImageTiles() {
            const canvas = document.createElement('canvas')
            canvas.width = this.state.overworldMazeEdit.rows * 64
            canvas.height = this.state.overworldMazeEdit.columns * 64
            const ctx = canvas.getContext('2d')

            const allBlocks = document.querySelectorAll('maze-block')
            Array.from(allBlocks).map(block => {
                const image = block.querySelector('img')
                const [ x, y ] = block.state.position.split(',').map(string => Number(string))
                ctx.drawImage(
                    image, // image
                    (y - 1) * 64, (x - 1) * 64, // sx, sy
                    64, 64, // sWidth, sHeight
                    )
            })
            return canvas.toDataURL()
        }

        #createBlock({ x, y }) {
            const block = document.createElement('maze-block')
            block.classList.add(classes['maze__block'])
            if (!this.state.containsEdges) block.classList.add(classes['maze__block--not-edges'])

            block.setAttribute('position', `${x},${y}`)
            block.state.position = `${x},${y}`
            block.setAttribute('type', this.state.overworldMazeEdit.getTile({ x, y }))
            block.state.type = this.state.overworldMazeEdit.getTile({ x, y })
            
            return block
        }

        #createMaze() {
            return (`<div class="${ classes['maze'] }">${
                (() => {
                    const lines = []
                    for (let i = 0; i < this.state.overworldMazeEdit.rows; i++) {
                        lines.push(`<div class="${ classes['line'] }">${
                            (() => {
                                const blocks = []

                                for (let j = 0; j < this.state.overworldMazeEdit.columns; j++) {
                                    blocks.push(this.#createBlock({ x: i+1, y: j+1}).outerText)
                                }

                                return blocks.join('')
                            })()
                        }</div>`)
                    }
                    return lines.join('')
                })()
            }</div>`)
        }

        #createMazeObjects(object) {
            const objectId = Object.keys(window.editors).find(editor => editor === object.id)
            const editor = window.editors[objectId]
            
            return (`
                <div id="${ objectId }" class="${ classes['maze__object'] }">
                    <div class="${ classes['block__content'] }">
                        <img src="${ editor.icon }" alt="${ editor.label }">
                    </div>
                </div>
            `)
        }

        render() {
            this.append(createElementFromHTML(this.#createMaze()))
            
            Object.keys(this.state.overworldMazeEdit.mazeObjects)
                .map(key => this.appendChild(createElementFromHTML(this.#createMazeObjects(this.state.overworldMazeEdit.mazeObjects[key]))))
            this.update()
        }

        update() {
            const maze = this.querySelector(`.${ classes['maze'] }`)
            const remainingLines = this.state.overworldMazeEdit.rows - maze.children.length

            // add - rows
            for (let i = 0; i < remainingLines; i++) {
                const line = document.createElement('div')
                line.classList.add(classes['line'])
                maze.append(line)

                for (let j = 0; j < this.state.overworldMazeEdit.columns; j++) {
                    if (!this.state.overworldMazeEdit.getTile({ x: maze.children.length, y: j + 1 })) {
                        this.state.overworldMazeEdit.add({ x: maze.children.length, y: j + 1 })
                    }
                    
                    line.append(this.#createBlock({ x: maze.children.length, y: j + 1 }))
                }
            }

            // remove - rows
            if (remainingLines < 0) {
                for (let i = 0; i < this.state.overworldMazeEdit.columns; i++) {
                    this.state.overworldMazeEdit.remove({ x: maze.children.length, y: i + 1 })
                }
                maze.lastChild.remove()
            }

            // add - columns
            const remainingColumns = this.state.overworldMazeEdit.columns - maze.children[0].children.length

            for (let i = 0; i < remainingColumns; i++) {
                Array.from(maze.children).forEach((line, key) => {
                    if (!this.state.overworldMazeEdit.getTile({ x: key + 1, y: maze.children[key].children.length + 1 })) {
                        this.state.overworldMazeEdit.add({ x: key + 1, y: maze.children[key].children.length + 1 })
                    }
                    
                    line.append(this.#createBlock({ x: key + 1, y: maze.children[key].children.length + 1 }))
                })
            }

            // remove - columns
            if (remainingColumns < 0) {
                for (let i = 0; i < this.state.overworldMazeEdit.rows; i++) {
                    this.state.overworldMazeEdit.remove({ x: i + 1, y: maze.children[i].children.length })
                    maze.children[i].lastChild.remove()
                }
            }
        }
    })