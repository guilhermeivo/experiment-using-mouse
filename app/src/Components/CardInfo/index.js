import { navigateTo } from '../../Common/common'
import ConnectionAPI from '../../Services/ConnectionAPI'
import classesForms from '../../assets/styles/forms_controls.module.scss'

import classes from './style.module.scss'

export const COMPONENT_TAG = 'card-info'

export default customElements.define(COMPONENT_TAG,
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            this.onLikeHandler = this.onLikeHandler.bind(this)
            this.onButtonPlayHandler = this.onButtonPlayHandler.bind(this)
            this.onButtonEditHandler = this.onButtonEditHandler.bind(this)

            this.state = {
                display: this.getAttribute('data-display'),
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

        async onLikeHandler(event) {
            const response = await ConnectionAPI.ToggleLikeMaze(this.state.id)

            const allsButtonLike = document.querySelectorAll(`#buttonLike--${ this.state.id }`)
            const allLikesNumber = document.querySelectorAll(`#likesNumber--${ this.state.id }`)

            if (response) {
                allsButtonLike.forEach((button, index) => {
                    if (button.firstElementChild.classList.contains(classes['marker__like--liked'])) {
                        allLikesNumber[index].textContent = parseInt(allLikesNumber[index].textContent) - 1
                    } else {
                        allLikesNumber[index].textContent = parseInt(allLikesNumber[index].textContent) + 1
                    }
                    button.firstElementChild.classList.toggle(classes['marker__like--liked'])
                })
            }
        }

        onButtonPlayHandler(event) {
            navigateTo(`/maze?id=${ this.state.id }`)
        }

        async onButtonEditHandler(event) {
            const response = await ConnectionAPI.GetMazeById(this.state.id)

            const json = JSON.stringify({ 
                idMaze: response.id,
                name: response.name, 
                rows: response.overworldMap.rows, 
                columns: response.overworldMap.columns, 
                configObjects: response.overworldMap.configObjects, 
                tilesMaze: response.overworldMap.tiles
            })
            localStorage.setItem('OverworldMaze', json)
            navigateTo(`/make?id=${ response.id }`)
        }

        addAllListeners() {
            const buttonLike = this.querySelector(`#buttonLike--${ this.state.id }`)
            buttonLike.addEventListener('click', this.onLikeHandler)

            const buttonPlay = this.querySelector(`#buttonPlay--${ this.state.id }`)
            buttonPlay.addEventListener('click', this.onButtonPlayHandler)

            const buttonEdit = this.querySelector(`#buttonEdit--${ this.state.id }`)
            if (buttonEdit) buttonEdit.addEventListener('click', this.onButtonEditHandler)
        }

        #createdCard() {
            return(/*html*/`
                <div class="${ classes['card-info'] } ${ classes[`display-${ this.state.display }`] }">
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
                                <span class="material-symbols notranslate">favorite</span><h4 id="likesNumber--${ this.state.id }" class="bold">${ this.state.likes }</h4>
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
            this.appendDOM(this.#createdCard())

            this.addAllListeners()
        }
    })