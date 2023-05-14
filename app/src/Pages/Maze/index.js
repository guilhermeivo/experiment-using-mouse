import Overworld from '../../Overworld'
import classes from './style.module.scss'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { createElementFromHTML, withGrid } from '../../Common/common'
import MazeObject from '../../MazeObject'
import Hero from "../../assets/images/characters/mario.png"
import Person from '../../Person'

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
        }

        async render() {
            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')
        
            this.append(createElementFromHTML(`
                <div class="${ classes['game-container'] }">
                    <canvas id="game-canvas" height="198"></canvas>
                </div>
            `))

            const response = await ConnectionAPI.GetMazeById(this.state.id)

            window.OverworldMaps['MazeMap'] = response[0].overworldMap

            const overworld = new Overworld({
                element: document.querySelector(`.${ classes['game-container'] }`)
            })
            overworld.initialize()
        }
    })

window.OverworldMaps = {
    MazeMap: { }
}