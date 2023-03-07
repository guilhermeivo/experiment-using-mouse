import uid from '../../utils/uid.js'
import { createElementFromHTML } from '../../utils/utils.js'
import styles from './style.module.scss'
const { locals: style } = styles

const SMALLEST_POSSIBLE_SIZE = 4
const LARGEST_POSSIBLE_SIZE = 20

export default customElements.define('maze-construction',
    class extends HTMLElement {

        // Atributos que quando alterados chamam o metodo attributeChangedCallback()
        static get observedAttributes() { return ['rows', 'columns'] }

        constructor(...props) {
            super(props)

            styles.use()

            this.createColumnHandler = this.createColumnHandler.bind(this)
            this.removeColumnHandler = this.removeColumnHandler.bind(this)
            this.createRowHandler = this.createRowHandler.bind(this)
            this.removeRowHandler = this.removeRowHandler.bind(this)

            this.mouseMoveHandler = this.mouseMoveHandler.bind(this)

            this.state = {
                amountOfRows: this.getAttribute('rows') || SMALLEST_POSSIBLE_SIZE,
                amountOfColumns: this.getAttribute('columns') || SMALLEST_POSSIBLE_SIZE,
                blocks: [],
                resizeSelected: '',
                initialPosition: undefined
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
                if (!this.hasAttribute('rows'))
                    this.#rows = this.state.amountOfRows
                if (!this.hasAttribute('columns'))
                    this.#columns = this.state.amountOfColumns

                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            this.removeEventsListener()
        }

        createColumnHandler(event) {
            const newValue = parseInt(this.columns) + 1
            this.#columns = newValue
            if (newValue != this.columns) return

            const lines = this.querySelector(`.${ style.maze }`).children
            Array.from(lines).forEach((line, key) => {
                const block = document.createElement('div')
                block.classList.add(style.maze__block)
                block.id = uid()

                line.append(block)
                this.state.blocks.push({ id: block.id, type: '', position: `${ key },${ this.columns - 1 }` })
            })

            this.update()
        }

        removeColumnHandler(event) {
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

            this.update()
        }

        createRowHandler(event) {
            const newValue = parseInt(this.rows) + 1
            this.#rows = newValue
            if (newValue != this.rows) return

            const maze = this.querySelector(`.${ style.maze }`)
            const line = document.createElement('div')
            line.classList.add(style.line)
            for (let i = 0; i < this.state.amountOfColumns; i++) {
                const block = document.createElement('div')
                block.classList.add(style.maze__block)
                block.id = uid()

                line.append(block)
                this.state.blocks.push({ id: block.id, type: '', position: `${ this.rows - 1 },${ i }` })
            }
            maze.append(line)

            this.update()
        }

        removeRowHandler(event) {
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

            this.update()
        }

        mouseMoveHandler(event) {
            const resizersBox = document.querySelector(`.${ style.resizable__resizers }`)
            const resizers = document.querySelectorAll(`.${ style.resizer }`)

            if (this.state.resizeSelected === 'right') {
                resizers.forEach(resizer => {
                    if (resizer.classList.contains('resizer--right')) {
                        if (this.state.initialPosition + 16 < event.pageX) {
                            window.removeEventListener('mousemove', this.mouseMoveHandler)
                            this.state = {
                                ...this.state,
                                resizeSelected: '',
                                initialPosition: undefined
                            }
                            this.createColumnHandler()
                        } else if (this.state.initialPosition - 16 > event.pageX) {
                            window.removeEventListener('mousemove', this.mouseMoveHandler)
                            this.state = {
                                ...this.state,
                                resizeSelected: '',
                                initialPosition: undefined
                            }
                            this.removeColumnHandler()
                        }
                    }
                })
            } else if (this.state.resizeSelected === 'left') {
                resizers.forEach(resizer => {
                    if (resizer.classList.contains('resizer--left')) {
                        if (this.state.initialPosition + 16 < event.pageX) {
                            window.removeEventListener('mousemove', this.mouseMoveHandler)
                            this.state = {
                                ...this.state,
                                resizeSelected: '',
                                initialPosition: undefined
                            }
                            this.removeColumnHandler()
                        } else if (this.state.initialPosition - 16 > event.pageX) {
                            window.removeEventListener('mousemove', this.mouseMoveHandler)
                            this.state = {
                                ...this.state,
                                resizeSelected: '',
                                initialPosition: undefined
                            }
                            this.createColumnHandler()
                        }
                    }
                })
            } else if (this.state.resizeSelected === 'bottom') {
                resizers.forEach(resizer => {
                    if (resizer.classList.contains('resizer--bottom')) {
                        if (this.state.initialPosition + 16 < event.pageY) {
                            window.removeEventListener('mousemove', this.mouseMoveHandler)
                            this.state = {
                                ...this.state,
                                resizeSelected: '',
                                initialPosition: undefined
                            }
                            this.createRowHandler()
                        } else if (this.state.initialPosition - 16 > event.pageY) {
                            window.removeEventListener('mousemove', this.mouseMoveHandler)
                            this.state = {
                                ...this.state,
                                resizeSelected: '',
                                initialPosition: undefined
                            }
                            this.removeRowHandler()
                        }
                    }
                })
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
            const changedValue = oldValue !== newValue

            if (changedValue) {
                switch (name) {
                    case '':
                        break
                }
            }
        }

        addEventsListener() {
            const resizers = document.querySelectorAll(`.${ style.resizer }`)

            resizers.forEach(resizer => {
                resizer.addEventListener('mousedown', event => {
                    event.preventDefault()

                    this.state = {
                        ...this.state,
                        resizeSelected: event.target.classList[1].split('--')[1],
                        initialPosition: event.target.classList[1].split('--')[1] === 'bottom' ? event.pageY : event.pageX
                    }

                    window.addEventListener('mousemove', this.mouseMoveHandler)
                    window.addEventListener('mouseup', () => {
                        window.removeEventListener('mousemove', this.mouseMoveHandler)
                        this.state = {
                            ...this.state,
                            resizeSelected: ''
                        }
                    })
                })
            })
        }

        removeEventsListener() {
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
                    let block = document.createElement('div')
                    block.classList.add(style.maze__block)
                    block.id = uid()
    
                    line.append(block)

                    this.state.blocks.push({ id: block.id, type: '', position: `${ i },${ j }` })
                }

                element.append(line)
            }

            return element
        }

        #createResizers() {
            return (`
                <div class="${ style.resizable }">
                    <div class="${ style.resizable__resizers }">
                        <div class="${ style.resizer } resizer--right"></div>
                        <div class="${ style.resizer } resizer--bottom"></div>
                        <div class="${ style.resizer } resizer--left"></div>
                    </div>
                </div>
            `)
        }

        render() {
            this.append(this.#createMaze())
            this.append(createElementFromHTML(this.#createResizers()))
            this.addEventsListener()
        }

        update() {
            if (this.rendered) {
                const resizable = document.querySelector(`.${ style.resizable__resizers }`)

                resizable.style.width = (this.state.amountOfColumns * 66) + 'px'
                resizable.style.height = (this.state.amountOfRows * 66) + 'px'
            }
        }
    })