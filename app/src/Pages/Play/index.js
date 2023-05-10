import classes from './style.module.scss'
import { checkToken } from "../../Common/common"
import ConnectionAPI from '../../Services/ConnectionAPI'

export default customElements.define('play-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            if (!checkToken(JSON.parse(sessionStorage.getItem('auth'))))
                window.location.href = `/login`
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
            const response = await ConnectionAPI.GetMazes()

            this.innerHTML = `
            <div class="${ classes['wrapper'] }">
                <h1>Play</h1>

                <div class="${ classes['list'] }">
                ${ (() => {
                    return response.map(element => {
                        return (`
                            <card-info
                                data-id="${ element.id }"
                                data-title="${ element.name }"
                                data-likes="${ element.like || 0 }"
                                data-views="${ element.views || 0 }"
                                ${ element.isLiked ? 'data-liked' : '' }
                                data-image="${ element.image }"
                            ></card-info>
                        `)
                    }).join('')
                })()}
                </div>
            </div>
            `

            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')
        }
    })