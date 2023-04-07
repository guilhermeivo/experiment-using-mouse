import { createElementFromHTML } from '../../utils/utils'
import apiService from "../../services/api"

import styles from './style.module.scss'
const { locals: style } = styles

export default customElements.define('card-info',
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            styles.use()

            this.onPlayClickHandler = this.onPlayClickHandler.bind(this)
            this.onLikeClickHandler = this.onLikeClickHandler.bind(this)

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

        onPlayClickHandler(event) { }

        onLikeClickHandler(event) { }

        addEventsListener() {
            this.querySelector(`#buttonPlay--${ this.state.id }`).addEventListener('click', this.onPlayClickHandler)
            this.querySelector('#buttonLike').addEventListener('click', this.onLikeClickHandler)
        }

        removeEventsListener() {
            this.querySelector(`#buttonPlay--${ this.state.id }`).removeEventListener('click', this.onPlayClickHandler)
            this.querySelector('#buttonLike').removeEventListener('click', this.onLikeClickHandler)
        }

        #createdCard() {
            return(`
            <div class="${ style['card-info'] }">
                <div class="${ style.card__image }"></div>
                <div id="buttonLike" class="${ style.card__marker }">
                    <div class="${ style.marker__like }">
                        <span class="material-symbols-outlined">favorite</span>
                    </div>
                </div>
                
                <div class="${ style.card__description }">
                    <h3>${ this.state.title }</h3>
                    <p class="caption"><span id="likesNumber" class="caption">${ this.state.likes }</span> Likes - <span id="viewsNumber" class="caption">${ this.state.views }</span> Views</p>
                
                    <div class="${ style.card__button }">
                        <div class="input-control">
                            <input id="buttonPlay--${ this.state.id }" type="button" value="Play">
                        </div>
                    </div>
                </div>
            </div>
            `)
        }

        async render() {
            this.append(createElementFromHTML(this.#createdCard()))
            this.addEventsListener()
        }
    })