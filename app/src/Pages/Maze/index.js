import Overworld from '../../Overworld'
import classes from './style.module.scss'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { createElementFromHTML, disableBackMenu, enableBackMenu, navigateTo } from '../../Common/common'
import classesForms from "../../assets/styles/forms_controls.module.scss"
import Counter from '../../Common/Counter'

export const PAGE_TAG = 'maze-page'

export default customElements.define(PAGE_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            if (!window.getParameterUrl('id')) history.back()

            this.onStartOverHandler = this.onStartOverHandler.bind(this)
            this.onExitHandler = this.onExitHandler.bind(this)

            this.state = {
                id: window.getParameterUrl('id')
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            disableBackMenu()

            document.querySelector('#wrapperInformations').remove()

            const headerNavigation = document.querySelector('#headerNavigation')
            headerNavigation.querySelector('#toolbarMenu').removeChild(document.querySelector('#wrapperTitle'))

            window.state.flags['eating-cheese'] = false
            this.counter.finish()
            delete this.counter
            window.OverworldMaps['MazeMap'] = { }
        }

        onStartOverHandler(event) {
            navigateTo(`/maze?id=${ this.state.id }`)
        }

        onExitHandler(event) {
            navigateTo(`/play`)
        }

        addAllListeners() {
            const buttonStartOver = document.querySelector('#buttonStartOver')
            buttonStartOver.addEventListener('click', this.onStartOverHandler)

            const buttonExit = document.querySelector('#buttonExit')
            buttonExit.addEventListener('click', this.onExitHandler)
        }

        #createHeader() {
            return (/*html*/`
                <div id="wrapperTitle">
                    <h1>${ this.state.name }</h1>
                </div>
            `)
        }

        #sectionScrollerMenu() {
            return (/*html*/`
                <div id="wrapperInformations">
                    <div class="${ classesForms['form-controls'] }">
                        <div class="${ classesForms['form__text-control'] }">
                            <input 
                                id="inputTimer" 
                                type="text" name="input-timer" placeholder=" " value="0:00" 
                                disabled />
                            <label for="inputTimer">Timer</label>
                            <span class="${ classesForms['form__error-message'] }"></span>
                        </div>
                        <div class="${ classesForms['form__text-control'] }">
                            <button 
                                id="buttonStartOver" 
                                class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">
                                Start Over
                            </button>
                        </div>
                        <div class="${ classesForms['form__text-control'] }">
                            <button 
                                id="buttonExit" 
                                class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            `)
        }

        #createPage() {
            return (/*html*/`
                <div class="${ classes['game-container'] }">
                    <pop-up hidden
                        data-title="Congratulations!" 
                        data-description="<span id='descriptionCongratulations'></span>" 
                        data-anchorlink="/maze?id=${ this.state.id },/play"
                        data-anchortext="Start Over,Exit"></pop-up>
                    <canvas id="game-canvas" height="198"></canvas>
                </div>
            `)
        }

        async renderCanvasMaze() {
            const response = await ConnectionAPI.GetMazeById(this.state.id)
            this.state.name = response[0].name
            window.OverworldMaps['MazeMap'] = response[0].overworldMap

            const overworld = new Overworld({
                element: document.querySelector(`.${ classes['game-container'] }`)
            })
            overworld.initialize()

            this.querySelector('#descriptionCongratulations').innerHTML = `You just completed the map <span class="bold">${ this.state.name }</span> in <span id="timer"></span>.`

            this.counter = new Counter({ interval: 1000, callback: time => {
                const inputTimer = document.querySelector('#inputTimer')
                const timerId = document.querySelector('#timer')

                inputTimer.value = `${ time.minutes }:${ time.seconds < 10 ? `0${ time.seconds }` : time.seconds }`
                timerId.textContent = `${ time.minutes }´${ time.seconds < 10 ? `0${ time.seconds }` : time.seconds }´´`

                if (window.state.flags['eating-cheese']) this.counter.finish()
            } })
            this.counter.start()

            const headerNavigation = document.querySelector('#headerNavigation')
            headerNavigation.querySelector('#toolbarMenu').append(createElementFromHTML(this.#createHeader()))
        }

        render() {
            enableBackMenu()

            this.appendDOM(this.#createPage())

            const floatingVertical = document.querySelector('#floatingVerticalMenu')
            floatingVertical.addContentElement({ title: 'Informations', element: this.#sectionScrollerMenu() })

            ConnectionAPI.addViewMaze(this.state.id)
            this.renderCanvasMaze()

            this.addAllListeners()
        }
    })

window.OverworldMaps = {
    MazeMap: { }
}