import { createElementFromHTML } from '../../Common/common'
import ConnectionAPI from '../../Services/ConnectionAPI'
import classes from './style.module.scss'

const DEFAULT_MAZE_ROWS = 8
const DEFAULT_MAZE_COLUMNS = 8

const TIME_SHOWING_MESSAGE = 1000
const MINIMUM_TIME_WAIT = 1000

export default customElements.define('make-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this)
            this.onResizersMovimentHandler = this.onResizersMovimentHandler.bind(this)
            this.onCreateMazeHandler = this.onCreateMazeHandler.bind(this)
            this.onSaveMazeHandler = this.onSaveMazeHandler.bind(this)

            this.state = {
                idMaze: localStorage.getItem('mazeId') || '',
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
            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (!backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.add('back-menu--disabled')

            const headerNavigation = document.querySelector('#headerNavigation')
            headerNavigation.querySelector('#toolbarMenu').removeChild(document.querySelector('blocks-toolbar'))

            const floatingVertical = document.querySelector('#floatingVertical')
            floatingVertical.removeChild(document.querySelector('#wrapperMaze'))

            this.removeEventsListener()
        }

        onMouseMoveHandler(event) {
            const resizers = document.querySelectorAll(`.${ classes.resizer }`)
            const tag = resizers[this.state.resizeSelected].classList[1].split('--')[1].split('_')[0]

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

        async onCreateMazeHandler(event) {
            const inputName = document.querySelector('#inputName')
            const response = await ConnectionAPI.CreateMaze(inputName.value, this.state.maze.exportEncodedString())
            localStorage.setItem('mazeId', response)
            event.target.removeEventListener('click', this.onCreateMazeHandler)
            document.location.reload()
        }

        async onSaveMazeHandler(event) {
            const targetClass = event.target.classList
            if (targetClass.contains('button__submit--active') || targetClass.contains('button__submit--done') || targetClass.contains('button__submit--error')) return
            
            targetClass.add('button__submit--active')

            Promise.all([new Promise(async (resolve, reject) => {
                try {
                    await ConnectionAPI.UpdateMaze(localStorage.getItem('mazeId'), this.state.maze.exportEncodedString())
                    resolve()
                } catch {
                    reject()
                }
            }), new Promise(resolve => setTimeout(resolve, MINIMUM_TIME_WAIT))])
            .then(() => {
                targetClass.remove('button__submit--active')
                targetClass.add('button__submit--done')

                setTimeout(() => {
                    targetClass.remove('button__submit--done')
                }, TIME_SHOWING_MESSAGE)
            })
            .catch(() => {
                targetClass.remove('button__submit--active')
                targetClass.add('button__submit--error')

                setTimeout(() => {
                    targetClass.remove('button__submit--error')
                }, TIME_SHOWING_MESSAGE)
            })
        }

        addEventsListener() {
            const resizers = document.querySelectorAll(`.${ classes.resizer }`)
            resizers.forEach(resizer => {
                resizer.addEventListener('mousedown', this.onResizersMovimentHandler)
            })

            const checkbox = document.querySelector('#checkboxEdges')
            checkbox.addEventListener('change', () => {
                this.state.maze.onChangeVisibilityEdges()
            })

            const buttonCreate = document.querySelector('#buttonCreate')
            if (buttonCreate) {
                buttonCreate.addEventListener('click', this.onCreateMazeHandler)
            }

            const buttonSave = document.querySelector('#buttonSave')
            if (buttonSave) {
                buttonSave.addEventListener('click', this.onSaveMazeHandler)
            }
        }

        removeEventsListener() {
            const resizers = document.querySelectorAll(`.${ classes.resizer }`)
            resizers.forEach(resizer => {
                resizer.removeEventListener('mousedown', this.onResizersMovimentHandler)
            })

            const buttonCreate = document.querySelector('#buttonCreate')
            if (buttonCreate) {
                buttonCreate.removeEventListener('click', this.onCreateMazeHandler)
            }

            const buttonSave = document.querySelector('#buttonSave')
            if (buttonSave) {
                buttonSave.removeEventListener('click', this.onSaveMazeHandler)
            }
        }

        #sectionScrollerMenu() {
            return (`
                <div id="wrapperMaze">
                    <div class="input-control">
                        <input id="inputName" type="text" name="input-name" placeholder=" " required />
                        <label for="inputName">Name maze</label>
                    </div>
                    <label class="form-control">
                        <input id="checkboxEdges" type="checkbox" name="checkbox-checked" checked />
                        Borders to limit the blocks
                    </label>
                    ${
                        this.state.idMaze
                            ? `<div class="input-control">
                                <button id="buttonSave" class="button button__secondary button__submit">Save</button>
                              </div>`
                            : `<div class="input-control">
                                <button id="buttonCreate" class="button button__secondary">Create</button>
                              </div>`
                    }
                    
                </div>
            `)
        }

        #createPage(encodedString) {
            return (`
                <div class="${ classes['wrapper_content'] }">
                    <editable-maze rows="${ DEFAULT_MAZE_ROWS }" columns="${ DEFAULT_MAZE_COLUMNS }" ${ encodedString ? `encodedString="${ encodedString }"` : '' }  editable></editable-maze>

                    <div class="${ classes['resizable'] }">
                        <div class="${ classes['resizable__resizers'] }">
                            <div class="${ classes['resizer'] } ${ classes['resizer--right'] }" key="0"></div>
                            <div class="${ classes['resizer'] } ${ classes['resizer--left'] }" key="1"></div>
                            <div class="${ classes['resizer'] } ${ classes['resizer--bottom'] }" key="2"></div>
                        </div>
                    </div>
                </div>
            `)
        }

        async render() {
            const floatingVertical = document.querySelector('floating-vertical')
            floatingVertical.addContentElement({ title: 'Maze Configurations', element: createElementFromHTML(this.#sectionScrollerMenu())})

            const headerNavigation = document.querySelector('#headerNavigation')
            if (headerNavigation.querySelector('#backMenu').classList.contains('back-menu--disabled')) 
                headerNavigation.querySelector('#backMenu').classList.remove('back-menu--disabled')

            headerNavigation.querySelector('#toolbarMenu').append(document.createElement('blocks-toolbar'))

            if (!this.state.idMaze) {
                this.append(createElementFromHTML(this.#createPage()))
            } else {
                const response = await ConnectionAPI.GetMazeById(this.state.idMaze)
                const inputName = document.querySelector('#inputName')
                inputName.value = response[0].name
                this.append(createElementFromHTML(this.#createPage(response[0].encodedString)))
            }

            this.state = {
                ...this.state,
                maze: document.querySelector('editable-maze')
            }

            this.addEventsListener()
        }

        update() {
            if (!this.rendered) return
            
            const resizable = document.querySelector(`.${ classes.resizable__resizers }`)
            
            resizable.style.width = (this.state.maze.state.amountOfColumns * 66) + 'px'
            resizable.style.height = (this.state.maze.state.amountOfRows * 66) + 'px'
        }
    })