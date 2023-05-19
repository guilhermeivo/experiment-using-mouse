import { createElementFromHTML, navigateTo } from '../../Common/common'
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
                image: this.getAttribute('data-image') || '',
                createdBy: this.getAttribute('data-createdBy') || 'anonymous'
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
            const buttonLike = this.querySelector(`#buttonLike--${ this.state.id }`)
            buttonLike.addEventListener('click', () => {
                const response = ConnectionAPI.ToggleLikeMaze(this.state.id)

                const allsButtonLike = document.querySelectorAll(`#buttonLike--${ this.state.id }`)
                if (response) {
                    allsButtonLike.forEach(button => button.firstElementChild.classList.toggle(classes['marker__like--liked']))
                }
            })

            const buttonPlay = this.querySelector(`#buttonPlay--${ this.state.id }`)
            buttonPlay.addEventListener('click', () => {
                navigateTo(`/maze?id=${ this.state.id }`)
            })
        }

        #createdCard() {
            return(`
            <div class="${ classes['card-info'] }">
                ${
                    this.state.image 
                    ? `<div class="${ classes['card__image'] }" style="background-image:url(${ this.state.image })"></div>`
                    : ''
                }
                <div id="buttonLike--${ this.state.id }" class="${ classes['card__marker'] }">
                    <div class="${ classes['marker__like'] }  ${ this.state.liked ? classes['marker__like--liked'] : '' }">
                        <span class="material-symbols notranslate">favorite</span>
                    </div>
                </div>
                
                <div class="${ classes['card__description'] }">
                    <h3>${ this.state.title }</h3>

                    <div class="${ classes['descrption__interaction'] }">
                        <div>
                            <span class="material-symbols notranslate">favorite</span><h4 id="likesNumber" class="bold">${ this.state.likes }</h4>
                        </div> 
                        <div>
                            <span class="material-symbols notranslate">person</span><h4 id="viewsNumber" class="bold">${ this.state.views }</h4>
                        </div>
                    </div>
                
                    <div class="${ classes['card__button'] }">
                        <div class="${ classesForms['form__text-control'] }">
                            <input id="buttonPlay--${ this.state.id }" type="button" value="Play" class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">
                        </div>
                        ${
                            !this.state.image 
                            ? `<div class="${ classesForms['form__text-control'] }">
                                <button id="buttonEdit--${ this.state.id }" class="material-symbols notranslate ${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">edit</button>
                            </div>`
                            : ''
                        }
                    </div>

                    ${
                        this.state.image 
                        ? `<div class="${ classes['description__details'] }">
                            <div class="${ classes['circle'] }"></div>
                            <p class="caption">Creating of <span class="bold caption">${ this.state.createdBy }</span></p>
                        </div>`
                        : ''
                    }
                </div>
            </div>
            `)
        }

        render() {
            this.append(createElementFromHTML(this.#createdCard()))

            this.addEventsListener()
        }
    })