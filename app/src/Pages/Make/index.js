import { checkToken, createElementFromHTML, downloadData, priorityInput, submitButtonHandler } from '../../Common/common'
import validators from '../../Common/validators'
import OverworldMazeEdit from '../../OverworldMazeEdit'
import ConnectionAPI from '../../Services/ConnectionAPI'

import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import { navigateTo } from '../../Common/common'

const SMALLEST_POSSIBLE_SIZE = 4
const LARGEST_POSSIBLE_SIZE = 20

let _defaultMazeRows = Math.round(window.innerHeight/66)-3
if (_defaultMazeRows < SMALLEST_POSSIBLE_SIZE) _defaultMazeRows = SMALLEST_POSSIBLE_SIZE
else if (_defaultMazeRows > LARGEST_POSSIBLE_SIZE) _defaultMazeRows = LARGEST_POSSIBLE_SIZE

let _defaultMazeColumns = window.innerWidth > 1280 ? Math.round(1280/66)-2 : Math.round(window.innerWidth/66)-2
if (_defaultMazeColumns < SMALLEST_POSSIBLE_SIZE) _defaultMazeColumns = SMALLEST_POSSIBLE_SIZE
else if (_defaultMazeColumns > LARGEST_POSSIBLE_SIZE) _defaultMazeColumns = LARGEST_POSSIBLE_SIZE

const DEFAULT_MAZE_ROWS = _defaultMazeRows
const DEFAULT_MAZE_COLUMNS = _defaultMazeColumns

const TIME_SHOWING_MESSAGE = 1000
const MINIMUM_TIME_WAIT = 1000

export default customElements.define('make-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this)
            this.onResizersMovimentHandler = this.onResizersMovimentHandler.bind(this)
            this.onSaveMazeHandler = this.onSaveMazeHandler.bind(this)
            this.onExportMazeHandler = this.onExportMazeHandler.bind(this)
            this.onInputRowsHandler = this.onInputRowsHandler.bind(this)
            this.onInputColumnsHandler = this.onInputColumnsHandler.bind(this)

            const OverworldMaze = JSON.parse(localStorage.getItem('OverworldMaze')) || { }
            
            this.state = {
                maze: '',
                resizeSelected: '',
                initialPosition: '',
                overworldMazeEdit: new OverworldMazeEdit({ 
                    smallestSize: SMALLEST_POSSIBLE_SIZE,
                    LARGEST_POSSIBLE_SIZE: LARGEST_POSSIBLE_SIZE,
                    rows: OverworldMaze.rows || DEFAULT_MAZE_ROWS, 
                    columns: OverworldMaze.columns || DEFAULT_MAZE_COLUMNS,
                    mazeObjects: OverworldMaze.mazeObjects || null,
                    tilesMaze: OverworldMaze.tilesMaze || null
                })
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
                this.update()
            }
        }

        disconnectedCallback() { 
            this.removeEventsListener()
            
            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (!backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.add('back-menu--disabled')

            const headerNavigation = document.querySelector('#headerNavigation')
            headerNavigation.querySelector('#toolbarMenu').removeChild(document.querySelector('blocks-toolbar'))

            const floatingVertical = document.querySelector('#floatingVertical')
            floatingVertical.removeChild(document.querySelector('#wrapperMaze'))
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

        onExportMazeHandler(event) {
            const dataUrl = this.state.maze.exportImageTiles()
            downloadData(dataUrl, 'maze.png')
        }

        async onSaveMazeHandler(event) {
            const validatorInputName = validators(
                '#inputName', { formElement: '#formTextName', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            
            const isValid = validatorInputName.isValidNotEmpty() && validatorInputName.isValidNotSpecialCharacters()
            if (!isValid) return 

            const inputName = document.querySelector('#inputName')

            submitButtonHandler(
                event.target,
                async (resolve, reject) => {
                    try {
                        const json = JSON.stringify({ 
                            name: inputName.value, 
                            rows: this.state.overworldMazeEdit.rows, 
                            columns: this.state.overworldMazeEdit.columns, 
                            mazeObjects: this.state.overworldMazeEdit.mazeObjects, 
                            tilesMaze: this.state.overworldMazeEdit.tilesMaze
                        })
                        localStorage.setItem('OverworldMaze', json)

                        if (!checkToken(JSON.parse(sessionStorage.getItem('auth')))) {
                            document.body.appendChild(createElementFromHTML(`
                                <pop-up 
                                    data-title="Account is required!" 
                                    data-description="To save this maze it is necessary to login or register to proceed:" 
                                    data-anchorlink="/login"
                                    data-anchortext="Sign In"></pop-up>
                            `))
                            const floatingVertical = document.querySelector('floating-vertical')
                            floatingVertical.toggle()
                            resolve()
                        } else {
                            const response = await ConnectionAPI.CreateMaze(inputName.value, inputName.value, this.state.maze.exportImageTiles())

                            if (response) {
                                localStorage.removeItem('OverworldMaze') 
                                resolve()
                            } else reject()
                        }
                    } catch (exception) {
                        reject()
                    }
                },
                () => navigateTo('play')
            )
        }

        onInputRowsHandler(event) {
            if (event.target.value > this.state.overworldMazeEdit.rows) this.state.maze.createRowHandler()
            else this.state.maze.removeRowHandler()

            event.target.value = this.state.overworldMazeEdit.rows
            this.update()
        }

        onInputColumnsHandler(event) {
            if (event.target.value > this.state.overworldMazeEdit.columns) this.state.maze.createColumnHandler()
            else this.state.maze.removeColumnHandler()

            event.target.value = this.state.overworldMazeEdit.columns
            this.update()
        }

        addEventsListener() {
            const resizers = document.querySelectorAll(`.${ classes['resizer'] }`)
            resizers.forEach(resizer => {
                resizer.addEventListener('mousedown', this.onResizersMovimentHandler)
            })

            const buttonSave = document.querySelector('#buttonSave')
            buttonSave.addEventListener('click', this.onSaveMazeHandler)

            const buttonExportImage = document.querySelector('#buttonExportImage')
            buttonExportImage.addEventListener('click', this.onExportMazeHandler)

            const checkbox = document.querySelector('#checkboxEdges')
            if (this.state.maze) {
                checkbox.addEventListener('change', this.state.maze.onChangeVisibilityEdges)
            }

            const numberRows = document.querySelector('#numberRows')
            numberRows.addEventListener('input', this.onInputRowsHandler)

            const numberColumns = document.querySelector('#numberColumns')
            numberColumns.addEventListener('input', this.onInputColumnsHandler)

            const buttonClearMaze = document.querySelector('#buttonClearMaze')
            buttonClearMaze.addEventListener('click', () => {
                localStorage.removeItem('OverworldMaze')  
                document.location.reload(false)
            })

            const inputEmail = document.querySelector('#inputName')
            inputEmail.addEventListener('keydown', priorityInput)

            const inputRows = document.querySelector('#numberRows')
            inputRows.addEventListener('keydown', priorityInput)

            const inputColumns = document.querySelector('#numberColumns')
            inputColumns.addEventListener('keydown',priorityInput)
        }

        removeEventsListener() {
            const resizers = document.querySelectorAll(`.${ classes['resizer'] }`)
            resizers.forEach(resizer => {
                resizer.removeEventListener('mousedown', this.onResizersMovimentHandler)
            })

            const buttonSave = document.querySelector('#buttonSave')
            buttonSave.removeEventListener('click', this.onSaveMazeHandler)

            const buttonExportImage = document.querySelector('#buttonExportImage')
            buttonExportImage.removeEventListener('click', this.onExportMazeHandler)

            const checkbox = document.querySelector('#checkboxEdges')
            if (this.state.maze) {
                checkbox.removeEventListener('change', this.state.maze.onChangeVisibilityEdges)
            }

            const numberRows = document.querySelector('#numberRows')
            numberRows.removeEventListener('input', this.onInputRowsHandler)

            const numberColumns = document.querySelector('#numberColumns')
            numberColumns.removeEventListener('input', this.onInputColumnsHandler)
        }

        #sectionScrollerMenu() {
            return (`
                <div id="wrapperMaze">
                    <div class="${ classesForms['form-controls'] }">
                        <div id="formTextName" class="${ classesForms['form__text-control'] }">
                            <input type="text" name="inputName" id="inputName" placeholder=" " autocomplete="off" required value="${ localStorage.getItem('OverworldMaze') ? JSON.parse(localStorage.getItem('OverworldMaze')).name : '' }" />
                            <label for="inputName">Name maze</label>
                            <span class="${ classesForms['form__error-message'] }"></span>
                        </div>
                        <div class="${ classesForms['form__text-control'] }">
                            <input type="number" name="numberRows" id="numberRows" min="${ SMALLEST_POSSIBLE_SIZE }" max="${ LARGEST_POSSIBLE_SIZE }" value="${ this.state.overworldMazeEdit.rows }" />
                            <label for="numberRows">Rows</label>
                        </div>
                        <div class="${ classesForms['form__text-control'] }">
                            <input type="number" name="numberColumns" id="numberColumns" min="${ SMALLEST_POSSIBLE_SIZE }" max="${ LARGEST_POSSIBLE_SIZE }" value="${ this.state.overworldMazeEdit.columns }" />
                            <label for="numberColumns">Column</label>
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
                        <div class="${ classesForms['form__text-control'] }">
                            <button 
                                id="buttonExportImage" 
                                class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">Export Image</button>
                        </div>
                        <div class="${ classesForms['form__text-control'] }">
                            <button 
                                id="buttonClearMaze" 
                                class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">Clear maze</button>
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

        render() {
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

            const numberRows = document.querySelector('#numberRows')
            numberRows.value = this.state.overworldMazeEdit.rows
            const numberColumns = document.querySelector('#numberColumns')
            numberColumns.value = this.state.overworldMazeEdit.columns

            const resizable = document.querySelector(`.${ classes['resizable__resizers'] }`)
            if (resizable) {
                resizable.style.width = (this.state.overworldMazeEdit.columns * 66) + 'px'
                resizable.style.height = (this.state.overworldMazeEdit.rows * 66) + 'px'
            }
        }
    })