import { createElementFromHTML } from '../../Common/common'
import validators from '../../Common/validators'
import OverworldMazeEdit from '../../OverworldMazeEdit'

import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'

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
                idMaze: sessionStorage.getItem('mazeId') || '',
                maze: '',
                resizeSelected: '',
                initialPosition: '',

                overworldMazeEdit: new OverworldMazeEdit({ rows: DEFAULT_MAZE_ROWS, columns: DEFAULT_MAZE_COLUMNS })
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
            const resizers = document.querySelectorAll(`.${ classes['resizer'] }`)
            const tag = resizers[this.state.resizeSelected].classList[1].split('--')[1].split('_')[0]

            switch (tag) {
                case 'right':
                    if (this.state.initialPosition + 32 < event.pageX) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageX
                        }
                        this.state.maze.createColumnHandler()
                    } else if (this.state.initialPosition - 32 > event.pageX) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageX
                        }
                        this.state.maze.removeColumnHandler()
                    }
                    break
                case 'left':
                    if (this.state.initialPosition + 32 < event.pageX) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageX
                        }
                        this.state.maze.removeColumnHandler()
                    } else if (this.state.initialPosition - 32 > event.pageX) {
                        this.state = {
                            ...this.state,
                            initialPosition: event.pageX
                        }
                        this.state.maze.createColumnHandler()
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
            const validatorInputName = validators(
                '#inputName', { formElement: '#formTextName', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            
            const isValid = validatorInputName.isValidNotEmpty() && validatorInputName.isValidNotSpecialCharacters()
            
            if (isValid) {
                try {
                    // ...
                } catch { }
            }     
        }

        async onSaveMazeHandler(event) {
            
            const targetClass = event.target.classList
            if (targetClass.contains(classesForms['button__submit--active']) || targetClass.contains(classesForms['button__submit--done']) || targetClass.contains(classesForms['button__submit--error'])) return

            const validatorInputName = validators(
                '#inputName', { formElement: '#formTextName', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            
            const isValid = validatorInputName.isValidNotEmpty() && validatorInputName.isValidNotSpecialCharacters()

            if (isValid) {
                const inputName = document.querySelector('#inputName')
                
                targetClass.add(classesForms['button__submit--active'])
                Promise.all([new Promise(async (resolve, reject) => {
                    try {
                        reject()
                    } catch (exception) {
                        reject()
                    }
                }), new Promise(resolve => setTimeout(resolve, MINIMUM_TIME_WAIT))])
                .then(() => {
                    targetClass.remove(classesForms['button__submit--active'])
                    targetClass.add(classesForms['button__submit--done'])
    
                    setTimeout(() => {
                        targetClass.remove(classesForms['button__submit--done'])
                    }, TIME_SHOWING_MESSAGE)
                })
                .catch(() => {
                    targetClass.remove(classesForms['button__submit--active'])
                    targetClass.add(classesForms['button__submit--error'])
    
                    setTimeout(() => {
                        targetClass.remove(classesForms['button__submit--error'])
                    }, TIME_SHOWING_MESSAGE)
                })
            }
        }

        addEventsListener() {
            const resizers = document.querySelectorAll(`.${ classes['resizer'] }`)
            resizers.forEach(resizer => {
                resizer.addEventListener('mousedown', this.onResizersMovimentHandler)
            })

            const buttonSave = document.querySelector('#buttonSave')
            if (buttonSave) {
                buttonSave.addEventListener('click', this.onSaveMazeHandler)
            }

            const checkbox = document.querySelector('#checkboxEdges')
            if (checkbox && this.state.maze) {
                checkbox.addEventListener('change', this.state.maze.onChangeVisibilityEdges)
            }
        }

        removeEventsListener() {
            const resizers = document.querySelectorAll(`.${ classes['resizer'] }`)
            resizers.forEach(resizer => {
                resizer.removeEventListener('mousedown', this.onResizersMovimentHandler)
            })

            const buttonSave = document.querySelector('#buttonSave')
            if (buttonSave) {
                buttonSave.removeEventListener('click', this.onSaveMazeHandler)
            }

            const checkbox = document.querySelector('#checkboxEdges')
            if (checkbox && this.state.maze) {
                checkbox.removeEventListener('change', this.state.maze.onChangeVisibilityEdges)
            }
        }

        #sectionScrollerMenu() {
            return (`
                <div id="wrapperMaze">
                    <div class="${ classesForms['form-controls'] }">
                        <div id="formTextName" class="${ classesForms['form__text-control'] }">
                            <input type="text" name="inputName" id="inputName" placeholder=" " autocomplete="off" required />
                            <label for="inputName">Name maze</label>
                            <span class="${ classesForms['form__error-message'] }"></span>
                        </div>
                        <div class="${ classesForms['form__checkbox-control'] }">
                            <input type="checkbox" name="checkboxEdges" id="checkboxEdges" checked />
                            <label for="checkboxEdges">Borders to limit the blocks</label>
                        </div>
                        <div class="${ classesForms['form__text-control'] }">
                            <button 
                                id="buttonSave" 
                                class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__secondary'] } ${ classesForms['button__submit'] }">Save</button>
                        </div>
                    </div>
                </div>
            `)
        }

        #createPage() {
            return (`
                <div class="${ classes['wrapper_content'] }">
                    <div class="${ classes['resizable'] }">
                        <div class="${ classes['resizable__resizers'] }">
                            <div class="${ classes['resizer'] } ${ classes['resizer--right'] }" key="0"></div>
                            <div class="${ classes['resizer'] } ${ classes['resizer--bottom'] }" key="1"></div>
                        </div>
                    </div>
                </div>
            `)
        }

        async render() {
            // floating vertical menu configurations local
            const floatingVertical = document.querySelector('floating-vertical')
            floatingVertical.addContentElement({ title: 'Maze Configurations', element: createElementFromHTML(this.#sectionScrollerMenu())})

            // back button appair
            const headerNavigation = document.querySelector('#headerNavigation')
            if (headerNavigation.querySelector('#backMenu').classList.contains('back-menu--disabled')) 
                headerNavigation.querySelector('#backMenu').classList.remove('back-menu--disabled')

            // toolbar menu create
            headerNavigation.querySelector('#toolbarMenu').append(document.createElement('blocks-toolbar'))

            this.append(createElementFromHTML(this.#createPage()))
            const mazeEdit = document.createElement('maze-edit')
            mazeEdit.setAttribute('editable', '')
            mazeEdit.onChangeVisibilityEdges()
            mazeEdit.state.overworldMazeEdit = this.state.overworldMazeEdit
            this.querySelector(`.${ classes['wrapper_content'] }`).append(mazeEdit)
            this.state = {
                ...this.state,
                maze: mazeEdit
            }

            this.addEventsListener()
        }

        update() {
            if (!this.rendered) return

            const resizable = document.querySelector(`.${ classes['resizable__resizers'] }`)
            if (resizable) {
                resizable.style.width = (this.state.overworldMazeEdit.columns * 66) + 'px'
                resizable.style.height = (this.state.overworldMazeEdit.rows * 66) + 'px'
            }
        }
    })