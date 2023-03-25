import { createElementFromHTML } from '../../utils/utils'

import styles from './style.module.scss'
const { locals: style } = styles

export default customElements.define('card-info',
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            styles.use()

            this.state = {
                id: this.getAttribute("data-id"),
                title: this.getAttribute("data-title") || 'Title',
                likes: this.getAttribute("data-likes") || '0',
                views: this.getAttribute("data-views") || '0'
            }
        }

        async connectedCallback() {
            if (!this.rendered) {
                await this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            this.removeEventsListener()
        }

        addEventsListener() {
        }

        removeEventsListener() {
        }

        #createCard() {
            return(`
            <div class="card-info" key="${ this.state.id }">
                <div class="card__image"></div>
                <div class="card__marker">
                    <div class="marker__like">
                        <span class="material-symbols-outlined">favorite</span>
                    </div>
                </div>
                
                <div class="card__description">
                    <h3>${ this.state.title }</h3>
                    <p class="caption">${ this.state.likes } Likes - ${ this.state.views } Views</p>
                
                    <div class="card__button">
                        <div class="input-control">
                            <input id="buttonPlay" type="button" value="Play">
                        </div>
                    </div>
                </div>
            </div>
            `)
        }

        async render() {
            this.append(createElementFromHTML(this.#createCard()))
            this.addEventsListener()
        }
    })