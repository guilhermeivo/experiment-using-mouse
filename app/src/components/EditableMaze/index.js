import tag from '../../utils/tags'
import { getAroundBlocks, uid } from '../../utils/utils'

import styles from './style.module.scss'
const { locals: style } = styles

const SMALLEST_POSSIBLE_SIZE = 4
const LARGEST_POSSIBLE_SIZE = 20

export default customElements.define('editable-maze',
    class extends HTMLElement {

        constructor(...props) {
            super(props)

            styles.use()

            this.updateMazeHandler = this.updateMazeHandler.bind(this)
            this.onChangeVisibilityEdges = this.onChangeVisibilityEdges.bind(this)
            
            this.state = {
                amountOfRows: this.getAttribute('rows') || SMALLEST_POSSIBLE_SIZE,
                amountOfColumns: this.getAttribute('columns') || SMALLEST_POSSIBLE_SIZE,
                blocks: [],
                editable: this.hasAttribute('editable') || false,
                tags: tag.allowedTags(),
                containsEdges: this.hasAttribute('editable') || false
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

        async connectedCallback() {       
            if (!this.rendered) {
                for (let i = 0; i < this.state.tags.length; i++) 
                    await this.state.tags[i].sprite.initialize()

                await this.render()
                this.rendered = true
            }
        }

        updateMazeHandler(updatedBlock) {
            if (!this.rendered) return

            this.state.tags.map(tag => {
                if (tag.id === updatedBlock.type && tag.unique) {
                    const existOtherTag = this.state.blocks.find(block => block.type === updatedBlock.type)
                    if (existOtherTag) document.querySelector(`#${ existOtherTag.id }`).setDefaultValue()
                }
            })

            const currentBlock = this.state.blocks.find(block => block.id === updatedBlock.id)
            currentBlock.type = updatedBlock.type
            let blocksAround = getAroundBlocks(this.state.blocks, currentBlock.position)
            blocksAround.map(block => {
                if (block) document.querySelector(`#${ block.id }`).update()
            })
        }

        onChangeVisibilityEdges(event) {
            this.state = { 
                ...this.state, 
                containsEdges: !this.state.containsEdges
            }
            this.update()
        }

        createLeftColumnHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.columns) + 1
            this.#columns = newValue
            if (newValue != this.columns) return

            const lines = this.querySelector(`.${ style.maze }`).children
            Array.from(lines).forEach((line, key) => {
                line.prepend(this.#createBlock({ position: `${ key },${ this.columns - 1 }` }))
            })
        }

        removeLeftColumnHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.columns) - 1
            this.#columns = newValue
            if (newValue != this.columns) return

            const lines = this.querySelector(`.${ style.maze }`).children
            Array.from(lines).forEach(line => {
                const firstBlock = line.firstChild

                const find = this.state.blocks.find(element => element.id === firstBlock.id )
                const index = this.state.blocks.indexOf(find)
                this.state.blocks.splice(index, 1)
                
                firstBlock.remove()
            })
        }

        createRightColumnHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.columns) + 1
            this.#columns = newValue
            if (newValue != this.columns) return

            const lines = this.querySelector(`.${ style.maze }`).children
            Array.from(lines).forEach((line, key) => {
                line.append(this.#createBlock({ position: `${ key },${ this.columns - 1 }` }))
            })
        }

        removeRightColumnHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.columns) - 1
            this.#columns = newValue
            if (newValue != this.columns) return

            const lines = this.querySelector(`.${ style.maze }`).children
            Array.from(lines).forEach(line => {
                const lastBLock = line.lastChild

                const find = this.state.blocks.find(element => element.id === lastBLock.id )
                const index = this.state.blocks.indexOf(find)
                this.state.blocks.splice(index, 1)
                
                lastBLock.remove()
            })
        }

        createRowHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.rows) + 1
            this.#rows = newValue
            if (newValue != this.rows) return

            const maze = this.querySelector(`.${ style.maze }`)
            const line = document.createElement('div')
            line.classList.add(style.line)
            for (let i = 0; i < this.state.amountOfColumns; i++) {
                line.append(this.#createBlock({ position: `${ this.rows - 1 },${ i }` }))
            }
            maze.append(line)
        }

        removeRowHandler() {
            if (!this.state.editable) throw new Error('Disable maze edit mode.')

            const newValue = parseInt(this.rows) - 1
            this.#rows = newValue
            if (newValue != this.rows) return

            const lastLine = this.querySelector(`.${ style.maze }`).lastChild
            Array.from(lastLine.children).forEach(block => {
                const find = this.state.blocks.find(element => element.id === block.id)
                const index = this.state.blocks.indexOf(find)
                this.state.blocks.splice(index, 1)
            })
            lastLine.remove()
        }

        exportEncodedString() {
            const encodedString = this.state.blocks.map(block => {
                return `${ block.position }-${ block.type }`
            }).join(';')
            
            return encodedString
        }

        #createBlock(options) {
            const block = document.createElement('maze-blocks')
            block.classList.add(style.maze__block)
            if (!this.state.containsEdges)
                block.classList.add(style['maze__block--not-edges'])
            block.id = uid()

            this.state.blocks.push({ id: block.id, type: block.state.type, position: options.position })

            return block
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
                    line.append(this.#createBlock({ position: `${ i },${ j }` }))
                }
                element.append(line)
            }

            return element
        }

        async render() {
            this.append(this.#createMaze())
        }

        update() {
            if (!this.rendered) return
            
            Array.from(document.querySelectorAll('.maze__block')).map(block => {
                block.classList.toggle('maze__block--not-edges')
            })
        }
    })