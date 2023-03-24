import EditableMaze from '../../components/EditableMaze'
import BlocksToolbar from '../../components/BlocksToolbar'
import MazeBlocks from '../../components/MazeBlocks'

import styles from './style.module.scss'
const { locals: style } = styles

const DEFAULT_MAZE_ROWS = 8
const DEFAULT_MAZE_COLUMNS = 8

export default customElements.define('create-maze', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            styles.use()

            this.mouseMoveHandler = this.mouseMoveHandler.bind(this)

            this.state = {
                maze: '',
                resizeSelected: '',
                initialPosition: ''
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            const customToolbarMenu = document.querySelector('#customToolbarMenu')
            customToolbarMenu.querySelector('blocks-toolbar').remove()

            this.removeEventsListener()
        }

        mouseMoveHandler(event) {
            const resizers = document.querySelectorAll(`.${ style.resizer }`)
            const tag = resizers[this.state.resizeSelected].classList[1].split('--')[1]

            switch (tag) {
                case 'right':
                    if (this.state.initialPosition + 32 < event.pageX) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageX
                        }
                        this.state.maze.createRightColumnHandler()
                    } else if (this.state.initialPosition - 32 > event.pageX) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageX
                        }
                        this.state.maze.removeRightColumnHandler()
                    }
                    break
                case 'left':
                    if (this.state.initialPosition + 32 < event.pageX) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageX
                        }
                        this.state.maze.removeLeftColumnHandler()
                    } else if (this.state.initialPosition - 32 > event.pageX) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageX
                        }
                        this.state.maze.createLeftColumnHandler()
                    }
                    break
                case 'bottom':
                    if (this.state.initialPosition + 32 < event.pageY) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageY
                        }
                        this.state.maze.createRowHandler()
                    } else if (this.state.initialPosition - 32 > event.pageY) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageY
                        }
                        this.state.maze.removeRowHandler()
                    }
                    break
            }

            this.update()
        }

        addEventsListener() {
            const resizers = document.querySelectorAll(`.${ style.resizer }`)

            resizers.forEach(resizer => {
                resizer.addEventListener('mousedown', event => {
                    event.preventDefault()

                    const tagResizer = event.target.classList[1].split('--')[1]

                    this.state = {
                        ...this.state,
                        resizeSelected: event.target.getAttribute('key'),
                        initialPosition: tagResizer === 'bottom' ? event.pageY : event.pageX
                    }

                    window.addEventListener('mousemove', this.mouseMoveHandler)
                    window.addEventListener('mouseup', () => {
                        window.removeEventListener('mousemove', this.mouseMoveHandler)
                        this.state = {
                            ...this.state,
                            resizeSelected: '',
                            initialPosition: ''
                        }
                    })
                })
            })

            const checkbox = document.getElementById('checkboxEdges')
            checkbox.addEventListener('change', event => this.state.maze.changeVisibilityEdges())
        }

        removeEventsListener() {
            const checkbox = document.getElementById('checkboxEdges')
            checkbox.removeEventListener('change', event => this.state.maze.changeVisibilityEdges())
        }

        #createPage() {
            return (`
                <div class="wrapper_content">
                    <editable-maze rows="${ DEFAULT_MAZE_ROWS }" columns="${ DEFAULT_MAZE_COLUMNS }" editable></editable-maze>

                    <div class="${ style.resizable }">
                        <div class="${ style.resizable__resizers }">
                            <div class="${ style.resizer } ${ style['resizer--right'] }" key="0"></div>
                            <div class="${ style.resizer } ${ style['resizer--left'] }" key="1"></div>
                            <div class="${ style.resizer } ${ style['resizer--bottom'] }" key="2"></div>
                        </div>
                    </div>

                    <label class="form-control">
                        <input id="checkboxEdges" type="checkbox" name="checkbox-checked" checked />
                        Bordas para limitar os blocos.
                    </label>
                </div class="wrapper_content">
            `)
        }

        render() {
            const wrapperElement = document.createElement('div')
            wrapperElement.innerHTML = this.#createPage()
            const contentElements = [...wrapperElement.children]
            contentElements.map(element => this.appendChild(element))

            const customToolbarMenu = document.querySelector('#customToolbarMenu')
            customToolbarMenu.innerHTML = `<blocks-toolbar></blocks-toolbar>`

            this.state = {
                ...this.state,
                maze: document.querySelector('editable-maze')
            }

            this.addEventsListener()
        }

        update() {
            if (!this.rendered) return
            
            const resizable = document.querySelector(`.${ style.resizable__resizers }`)
            
            resizable.style.width = (this.state.maze.state.amountOfColumns * 66) + 'px'
            resizable.style.height = (this.state.maze.state.amountOfRows * 66) + 'px'
        }
    })