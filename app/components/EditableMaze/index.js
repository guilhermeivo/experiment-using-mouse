import uid from '../../utils/uid.js'
import tag from '../../utils/tags'
import { getDirectoryAssetsPath } from '../../utils/utils.js'
import Sprite from '../../scripts/Sprite'

import styles from './style.module.scss'
const { locals: style } = styles

const SMALLEST_POSSIBLE_SIZE = 4
const LARGEST_POSSIBLE_SIZE = 20

const sprites = {
    'edge-top-left': [ 0, 0 ],
    'edge-top': [ 1, 0 ],
    'edge-top-right': [ 2, 0 ],
    'edge-center-left': [ 3, 0 ],
    'edge-center': [ 4, 0 ],
    'edge-center-right': [ 5, 0 ],
    'edge-bottom-left': [ 6, 0 ],
    'edge-bottom': [ 7, 0 ],
    'edge-bottom-right': [ 8, 0 ],

    'grass-variants': [ [ 0, 1 ], [ 1, 1 ], [ 2, 1 ], [ 3, 1 ], [ 4, 1 ], [ 5, 1 ], [ 6, 1 ], [ 7, 1 ], [ 8, 1 ] ]
}

export default customElements.define('editable-maze',
    class extends HTMLElement {

        constructor(...props) {
            super(props)

            styles.use()

            this.createColumnHandler = this.createColumnHandler.bind(this)
            this.removeColumnHandler = this.removeColumnHandler.bind(this)
            this.createRowHandler = this.createRowHandler.bind(this)
            this.removeRowHandler = this.removeRowHandler.bind(this)

            this.updateMazeHandler = this.updateMazeHandler.bind(this)
            
            this.state = {
                amountOfRows: this.getAttribute('rows') || SMALLEST_POSSIBLE_SIZE,
                amountOfColumns: this.getAttribute('columns') || SMALLEST_POSSIBLE_SIZE,
                blocks: [],
                editable: this.hasAttribute('editable') || false,
                sprite: new Sprite({
                    src: getDirectoryAssetsPath('FileMap', 'image'),
                    sprites: sprites
                })
            }
        }

        get rows() {
            if (this.hasAttribute('rows')) return this.getAttribute('rows')
        }

        set #rows(value) {
            if (value >= SMALLEST_POSSIBLE_SIZE && value <= LARGEST_POSSIBLE_SIZE) {
                this.setAttribute('rows', value)
                this.state = { 
                    ...this.state, 
                    amountOfRows: this.rows
                }
            } else {
                this.setAttribute('rows', this.state.amountOfRows)
            }
        }

        get columns() {
            if (this.hasAttribute('columns')) return this.getAttribute('columns')
        }

        set #columns(value) {
            if (value >= SMALLEST_POSSIBLE_SIZE && value <= LARGEST_POSSIBLE_SIZE) {
                this.setAttribute('columns', value)
                this.state = { 
                    ...this.state, 
                    amountOfColumns: this.columns
                }
            } else {
                this.setAttribute('columns', this.state.amountOfColumns)
            }
        }

        connectedCallback() {       
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        updateMazeHandler(updatedBlock) {
            const blocks = this.state.blocks
            const index = blocks.map(b => b.id).indexOf(updatedBlock.id)

            tag.allowedTags().map(tag => {
                if (tag.id === updatedBlock.type && tag.unique) {
                    const found = blocks.find(value => value.type === updatedBlock.type)
                    if (found) document.querySelector(`#${ found.id }`).setDefaultValue()
                }
            })

            this.state.blocks[index].type = updatedBlock.type
        }

        createColumnHandler(event) {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.columns) + 1
            this.#columns = newValue
            if (newValue != this.columns) return

            const lines = this.querySelector(`.${ style.maze }`).children
            Array.from(lines).forEach((line, key) => {
                const block = document.createElement('maze-blocks')
                block.classList.add(style.maze__block)
                block.id = uid()

                line.append(block)
                this.state.blocks.push({ id: block.id, type: block.state.type, position: `${ key },${ this.columns - 1 }` })
            })
        }

        removeColumnHandler(event) {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.columns) - 1
            this.#columns = newValue
            if (newValue != this.columns) return

            const lines = this.querySelector(`.${ style.maze }`).children
            Array.from(lines).forEach((line, key) => {
                const lastBLock = line.lastChild

                const find = this.state.blocks.find((element) => {
                    return element.id === lastBLock.id
                })
                const index = this.state.blocks.indexOf(find)
                this.state.blocks.splice(index, 1)
                
                lastBLock.remove()
            })
        }

        createRowHandler(event) {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.rows) + 1
            this.#rows = newValue
            if (newValue != this.rows) return

            const maze = this.querySelector(`.${ style.maze }`)
            const line = document.createElement('div')
            line.classList.add(style.line)
            for (let i = 0; i < this.state.amountOfColumns; i++) {
                const block = document.createElement('maze-blocks')
                block.classList.add(style.maze__block)
                block.id = uid()

                line.append(block)

                this.state.blocks.push({ id: block.id, type: block.getAttribute('type'), position: `${ this.rows - 1 },${ i }` })
            }
            maze.append(line)
        }

        removeRowHandler(event) {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.rows) - 1
            this.#rows = newValue
            if (newValue != this.rows) return

            const lastLine = this.querySelector(`.${ style.maze }`).lastChild
            Array.from(lastLine.children).forEach((block, key) => {
                const find = this.state.blocks.find((element) => {
                    return element.id === block.id
                })
                const index = this.state.blocks.indexOf(find)
                this.state.blocks.splice(index, 1)
            })
            lastLine.remove()
        }

        #createMaze() {
            let element = document.createElement('div')
            element.classList.add(style.maze)

            element.style.gridTemplateColumns = `repeat(${ this.state.amountOfColumns }, 1fr)`
            element.style.gridTemplateRows = `repeat(${ this.state.amountOfRows }, 1fr)`

            for (let i = 0; i < this.state.amountOfRows; i++) {
                let line = document.createElement('div')
                line.classList.add(style.line)

                for (let j = 0; j < this.state.amountOfColumns; j++) {
                    let block = document.createElement('maze-blocks')
                    block.classList.add(style.maze__block)
                    block.id = uid()
    
                    line.append(block)

                    this.state.blocks.push({ id: block.id, type: block.state.type, position: `${ i },${ j }` })
                }

                element.append(line)
            }

            return element
        }

        render() {
            this.append(this.#createMaze())
        }
    })