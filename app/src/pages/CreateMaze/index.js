import apiService from "../../services/api"
import { createElementFromHTML } from '../../utils/utils'

import styles from './style.module.scss'
const { locals: style } = styles

const DEFAULT_MAZE_ROWS = 8
const DEFAULT_MAZE_COLUMNS = 8

export default customElements.define('create-maze', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            styles.use()

            this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this)
            this.onOpenCustomMenuHandler = this.onOpenCustomMenuHandler.bind(this)
            this.onSaveMazeHandler = this.onSaveMazeHandler.bind(this)
            this.onResizersMovimentHandler = this.onResizersMovimentHandler.bind(this)

            this.state = {
                maze: '',
                resizeSelected: '',
                initialPosition: ''
            }
        }

        async connectedCallback() {
            if (!this.rendered) {
                await this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            const headerNavigation = document.querySelector('header-navigation')
            headerNavigation.removeCustomToolbarMenu()
            headerNavigation.removeCustomMenu()

            this.removeEventsListener()
        }

        onMouseMoveHandler(event) {
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

        onOpenCustomMenuHandler(event) {
            const scrollerVertical = document.querySelector('.scroller-vertical')
            scrollerVertical.classList.toggle('scroller-vertical__disable')
        }

        onSaveMazeHandler(event) {
            const editableMaze = document.querySelector('editable-maze')
            const inputName = document.querySelector('#inputName')
            if (inputName.value != '') {
                apiService.PostMaze(inputName.value, ' ', ' ', editableMaze.exportEncodedString())
            }
        }

        onResizersMovimentHandler(event) {
            event.preventDefault()

            const tagResizer = event.target.classList[1].split('--')[1]

            this.state = {
                ...this.state,
                resizeSelected: event.target.getAttribute('key'),
                initialPosition: tagResizer === 'bottom' ? event.pageY : event.pageX
            }

            window.addEventListener('mousemove', this.onMouseMoveHandler)
            window.addEventListener('mouseup', () => {
                window.removeEventListener('mousemove', this.onMouseMoveHandler)
                this.state = {
                    ...this.state,
                    resizeSelected: '',
                    initialPosition: ''
                }
            })
        }

        addEventsListener() {
            const resizers = document.querySelectorAll(`.${ style.resizer }`)
            resizers.forEach(resizer => {
                resizer.addEventListener('mousedown', this.onResizersMovimentHandler)
            })

            const checkbox = document.querySelector('#checkboxEdges')
            checkbox.addEventListener('change', () => {
                this.state.maze.onChangeVisibilityEdges()
            })

            const customMenu = document.querySelector('#customMenu').querySelector('.icon')
            customMenu.addEventListener('click', this.onOpenCustomMenuHandler)

            const buttonSave = document.querySelector('#buttonSave')
            buttonSave.addEventListener('click', this.onSaveMazeHandler)
        }

        removeEventsListener() {
            const resizers = document.querySelectorAll(`.${ style.resizer }`)
            resizers.forEach(resizer => {
                resizer.removeEventListener('mousedown', this.onResizersMovimentHandler)
            })
        }

        #createMenuIcon() {
            return (`
                <div class="icon">
                    <span class="material-symbols-outlined">menu</span>
                </div>
            `)
        }

        #createPage() {
            return (`
                <div class="${ style.wrapper_content }">
                    <editable-maze rows="${ DEFAULT_MAZE_ROWS }" columns="${ DEFAULT_MAZE_COLUMNS }" editable></editable-maze>

                    <div class="${ style.resizable }">
                        <div class="${ style.resizable__resizers }">
                            <div class="${ style.resizer } ${ style['resizer--right'] }" key="0"></div>
                            <div class="${ style.resizer } ${ style['resizer--left'] }" key="1"></div>
                            <div class="${ style.resizer } ${ style['resizer--bottom'] }" key="2"></div>
                        </div>
                    </div>

                    <div class="${ style['scroller-vertical'] } ${ style['scroller-vertical__disable'] }">
                        <div class="${ style.scroller__title }"><h4>Setup</h4></div>
                        
                        <div class="input-control">
                            <input id="inputName" type="text" name="input-name" placeholder=" " required />
                            <label for="inputName">Name maze</label>
                        </div>
                        <label class="form-control">
                            <input id="checkboxEdges" type="checkbox" name="checkbox-checked" checked />
                            Borders to limit the blocks
                        </label>
                        <div class="input-control">
                            <input id="buttonSave" type="button" value="Save">
                        </div>
                    </div>
                </div>
            `)
        }

        async render() {
            this.append(createElementFromHTML(this.#createPage()))

            this.state = {
                ...this.state,
                maze: document.querySelector('editable-maze')
            }

            const headerNavigation = document.querySelector('header-navigation')
            headerNavigation.addCustomToolbarMenu(document.createElement('blocks-toolbar'))
            headerNavigation.addCustomMenu(createElementFromHTML(this.#createMenuIcon()))

            this.addEventsListener()
        }

        update() {
            if (!this.rendered) return
            
            const resizable = document.querySelector(`.${ style.resizable__resizers }`)
            
            resizable.style.width = (this.state.maze.state.amountOfColumns * 66) + 'px'
            resizable.style.height = (this.state.maze.state.amountOfRows * 66) + 'px'
        }
    })