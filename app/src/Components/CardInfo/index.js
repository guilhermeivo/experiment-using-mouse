import { createElementFromHTML } from '../../Common/common'
import ConnectionAPI from '../../Services/ConnectionAPI'
import classesForms from '../../assets/styles/forms_controls.module.scss'

import classes from './style.module.scss'

export default customElements.define('card-info',
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            this.state = {
                id: this.getAttribute('data-id'),
                title: this.getAttribute('data-title') || 'Title',
                likes: this.getAttribute('data-likes') || '0',
                views: this.getAttribute('data-views') || '0',
                liked: this.hasAttribute('data-liked') || false,
                image: this.getAttribute('data-image') || ''
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
        }

        addEventsListener() {
            const buttonLike = document.querySelector('#buttonLike')
            buttonLike.addEventListener('click', () => {
                const response = ConnectionAPI.ToggleLikeMaze(this.state.id)

                if (response) buttonLike.firstElementChild.classList.toggle(classes['marker__like--liked'])
            })
        }

        #createdCard() {
            return(`
            <div class="${ classes['card-info'] }">
                <div class="${ classes['card__image'] }" style="background-image:url(${ this.state.image })"></div>
                <div id="buttonLike" class="${ classes['card__marker'] }">
                    <div class="${ classes['marker__like'] }  ${ this.state.liked ? classes['marker__like--liked'] : '' }">
                        <span class="material-symbols">favorite</span>
                    </div>
                </div>
                
                <div class="${ classes['card__description'] }">
                    <h3>${ this.state.title }</h3>
                    <p class="caption"><span id="likesNumber" class="caption">${ this.state.likes }</span> Likes - <span id="viewsNumber" class="caption">${ this.state.views }</span> Views</p>
                
                    <div class="${ classes['card__button'] }">
                        <div class="${ classesForms['form__text-control'] }">
                            <input id="buttonPlay--${ this.state.id }" type="button" value="Play" class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">
                        </div>
                    </div>
                </div>
            </div>
            `)
        }

        render() {
            this.append(createElementFromHTML(this.#createdCard()))

            this.addEventsListener()
        }
    })