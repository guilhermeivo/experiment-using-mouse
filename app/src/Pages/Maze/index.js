import Overworld from '../../Overworld'
import classes from './style.module.scss'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { createElementFromHTML, navigateTo } from '../../Common/common'
import classesForms from "../../assets/styles/forms_controls.module.scss"

export default customElements.define('maze-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            const urlParams = new URLSearchParams(window.location.search)
            const id = urlParams.get('id')

            if (!id) window.location.href = `/`

            this.state = {
                id: id
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

            const floatingVertical = document.querySelector('#floatingVertical')
            floatingVertical.removeChild(document.querySelector('#wrapperInformations'))

            const headerNavigation = document.querySelector('#headerNavigation')
            headerNavigation.querySelector('#toolbarMenu').removeChild(document.querySelector('#wrapperTitle'))
        }

        addEventsListener() {
            const buttonStartOver = document.querySelector('#buttonStartOver')
            buttonStartOver.addEventListener('click', () => { navigateTo(`/maze?id=${ this.state.id }`) })

            const buttonExit = document.querySelector('#buttonExit')
            buttonExit.addEventListener('click', () => { navigateTo(`/play`) })
        }

        async render() {
            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')

            this.append(createElementFromHTML(`
                <div class="${ classes['game-container'] }">
                    <pop-up hidden
                        data-title="Congratulations!" 
                        data-description="<span id='descriptionCongratulations'></span>" 
                        data-anchorlink="/maze?id=${ this.state.id },/play"
                        data-anchortext="Start Over,Exit"></pop-up>
                    <canvas id="game-canvas" height="198"></canvas>
                </div>
            `))

            const floatingVertical = document.querySelector('floating-vertical')
            floatingVertical.addContentElement({ title: 'Informations', element: createElementFromHTML(`
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
            `)})

            ConnectionAPI.addViewMaze(this.state.id)

            const response = await ConnectionAPI.GetMazeById(this.state.id)
            window.OverworldMaps['MazeMap'] = response[0].overworldMap

            const overworld = new Overworld({
                element: document.querySelector(`.${ classes['game-container'] }`)
            })
            overworld.initialize()

            // toolbar menu create
            const headerNavigation = document.querySelector('#headerNavigation')
            headerNavigation.querySelector('#toolbarMenu').append(createElementFromHTML(`
                <div id="wrapperTitle">
                    <h1>${ response[0].name }</h1>
                </div>
            `))

            this.querySelector('#descriptionCongratulations').innerHTML = `You just completed the map <span class="bold">${ response[0].name }</span> in <span id="timer"></span>.`

            const inputTimer = document.querySelector('#inputTimer')
            const timerId = document.querySelector('#timer')
            let timer = 0
            const myTimer = setInterval(() => {
                if (!this.querySelector('pop-up').hasAttribute('hidden')) clearInterval(myTimer)

                const minutes = parseInt(timer / 60, 10)
                const seconds = parseInt(timer % 60, 10)
                timer++

                const toStringTimer = (minutes, seconds) => {
                    return `${ minutes }:${ seconds < 10 ? `0${ seconds }` : seconds }`
                }
                inputTimer.value = toStringTimer(minutes, seconds)
                timerId.textContent = `${ inputTimer.value.split(':')[0] }´${ inputTimer.value.split(':')[1] }´´`
            }, 1000)

            this.addEventsListener()
        }
    })

window.OverworldMaps = {
    MazeMap: { }
}