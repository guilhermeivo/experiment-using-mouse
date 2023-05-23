import classes from './style.module.scss'
import { checkToken, disableBackMenu, enableBackMenu, navigateTo } from "../../Common/common"
import ConnectionAPI from '../../Services/ConnectionAPI'
import classesForms from '../../assets/styles/forms_controls.module.scss'

export const PAGE_TAG = 'play-page'

export default customElements.define(PAGE_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            disableBackMenu()
        }

        addAllListeners() {
            this.querySelector('#createNewMaze').addEventListener('click', () => {
                localStorage.removeItem('OverworldMaze')
                navigateTo('/make')
            })
        }

        async #renderPrivateMazes() {
            const responseGetMazeByUser = await ConnectionAPI.GetMazeByUser()

            this.querySelector('#privateMazes').appendDOM(responseGetMazeByUser.map(element => {
                return (`
                    <card-info
                        data-id="${ element.id }"
                        data-title="${ element.name }"
                        data-likes="${ element.like || 0 }"
                        data-views="${ element.view || 0 }"
                        ${ element.isLiked ? 'data-liked' : '' }
                    ></card-info>
                `)
            }).join(''), 'afterbegin')
        }

        async #renderPublicMazes() {
            const responseGetMazes = await ConnectionAPI.GetMazes()

            if (responseGetMazes.length > 0) {
                this.querySelector('#publicMazes').appendDOM(responseGetMazes.map(element => {
                    return (`
                        <card-info
                            data-id="${ element.id }"
                            data-title="${ element.name }"
                            data-likes="${ element.like || 0 }"
                            data-views="${ element.view || 0 }"
                            data-createdBy="${ element.createdBy.username || '' }"
                            ${ element.isLiked ? 'data-liked' : '' }
                            data-image="${ element.overworldMap.lowerSrc }"
                        ></card-info>
                    `)
                }).join(''))
            } else {
                this.querySelector('#publicMazes').appendDOM(`<p>There is no maze at the moment.</p>`)
            }
        }

        #createPage() {            
            return (/*html*/`
                <div class="${ classes['wrapper'] }">
                    <h1>My mazes</h1>

                    <div class="${ classes['list--horizontal'] }">
                        <div id="privateMazes">
                            <div id="createNewMaze" class="${ classes['card'] }">
                                <span class="material-symbols notranslate">
                                add
                                </span>
                            </div>
                        </div>
                    </div>

                    <h1>Public mazes</h1>

                    <div class="${ classesForms['form-controls'] } ${ classes['search'] }">
                        <div class="${ classesForms['form__text-control'] }">
                            <input id="inputSearch" type="text" name="input-search" placeholder=" " />
                            <label for="inputSearch">Search</label>
                            <span class="${ classesForms['form__error-message'] }"></span>
                        </div>
                        <div class="${ classes['search__buttons'] }">
                            <div class="${ classesForms['form__text-control'] }">
                                <button 
                                    id="button" 
                                    class="material-symbols notranslate ${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">
                                    filter_list
                                </button>
                            </div>
                            <div class="${ classesForms['form__text-control'] }">
                                <button 
                                    id="button" 
                                    class="material-symbols notranslate ${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">
                                    search
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="publicMazes" class="${ classes['list--vertical'] }"></div>
                </div>
            `)
        }

        render() {
            if (!checkToken()) {
                navigateTo('/login')
                const message = document.querySelector('message-info')
                message.addMessageInfo({ description: `To proceed you need to login or register.`, type: 'warn' })
            } else {
                this.appendDOM(this.#createPage())

                this.#renderPrivateMazes()
                this.#renderPublicMazes()

                enableBackMenu()
                this.addAllListeners()
            }
        }
    })