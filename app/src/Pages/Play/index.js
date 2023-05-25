import classes from './style.module.scss'
import { checkToken, disableBackMenu, enableBackMenu, navigateTo } from "../../Common/common"
import ConnectionAPI from '../../Services/ConnectionAPI'
import classesForms from '../../assets/styles/forms_controls.module.scss'

export const PAGE_TAG = 'play-page'

export default customElements.define(PAGE_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onChangeHandler = this.onChangeHandler.bind(this)
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

            const buttonFilter = document.querySelector('#buttonFilter')
            const floatingVerticalFilter = document.querySelector('#floatingVerticalFilter')
            buttonFilter.addEventListener('click', () => { 
                floatingVerticalFilter.toggle() 
            })

            const buttonVisibility = document.querySelector('#buttonVisibility')
            const floatingVerticalVisibility = document.querySelector('#floatingVerticalVisibility')
            buttonVisibility.addEventListener('click', () => { 
                floatingVerticalVisibility.toggle() 
            })

            const inputSearch = document.querySelector('#inputSearch')
            inputSearch.addEventListener('change', this.onChangeHandler)

            const radioDisplayOptions = document.querySelectorAll('[name="displayOptions"]')
            radioDisplayOptions.forEach(item => item.addEventListener('change', this.onChangeHandler))

            const radioSortBy = document.querySelectorAll('[name="sortBy"]')
            radioSortBy.forEach(item => item.addEventListener('change', this.onChangeHandler))

            const numberRows = document.querySelector('#numberRows')
            numberRows.addEventListener('change', this.onChangeHandler)

            const numberColumns = document.querySelector('#numberColumns')
            numberColumns.addEventListener('change', this.onChangeHandler)
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

        onChangeHandler(event) {
            const inputSearch = document.querySelector('#inputSearch').value || null
            const radioSortBy = document.querySelector('[name="sortBy"]:checked').value || null
            const numberRows = document.querySelector('#numberRows').value || null
            const numberColumns = document.querySelector('#numberColumns').value || null

            const request = {
                q: inputSearch,
                sortBy: radioSortBy,
                filters: {
                    dimensions: [ numberRows, numberColumns ]
                }
            }
        }

        #sectionScrollerDisplayOptions() {
            return (/*html*/`
                <div id="wrapperDisplayOptions">
                    <div class="${ classesForms['form-controls'] } ${ classes['visibility__display-options'] }">
                        <div class="${ classesForms['form__radio-control'] }">
                            <div>
                                <input type="radio" id="grid" name="displayOptions" value="grid" checked>
                                <label for="grid">
                                    <span class="material-symbols notranslate">
                                    grid_view
                                    </span>
                                    Grid
                                </label>
                            </div>
                            <div>
                                <input type="radio" id="list" name="displayOptions" value="list">
                                <label for="list">
                                    <span class="material-symbols notranslate">
                                    list
                                    </span>
                                    List
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        }

        #sectionScrollerSortBy() {
            return (/*html*/`
                <div id="wrapperSortBy">
                    <div class="${ classesForms['form-controls'] } ${ classes['visibility__sort-by'] }">
                        <div class="${ classesForms['form__radio-control'] }">
                            <input type="radio" id="alphabetical" name="sortBy" value="alphabetical" checked>
                            <label for="alphabetical">Alphabetical</label>
                        </div>
                        <div class="${ classesForms['form__radio-control'] }">
                            <input type="radio" id="releaseDate" name="sortBy" value="releaseDate">
                            <label for="releaseDate">Release Date</label>
                        </div>
                        <div class="${ classesForms['form__radio-control'] }">
                            <input type="radio" id="likes" name="sortBy" value="likes">
                            <label for="likes">Likes</label>
                        </div>
                    </div>
                </div>
            `)
        }

        #sectionScrollerDimensions() {
            return (/*html*/`
                <div id="wrapperDimensions">
                    <div class="${ classesForms['form-controls'] }">
                        <div class="${ classesForms['form__text-control'] }">
                            <input type="number" name="numberRows" id="numberRows" />
                            <label for="numberRows">Rows</label>
                        </div>
                        <div class="${ classesForms['form__text-control'] }">
                            <input type="number" name="numberColumns" id="numberColumns"  />
                            <label for="numberColumns">Columns</label>
                        </div>
                    </div>
                </div>
            `)
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

                    <div class="${ classes['options'] }">
                        <div class="${ classesForms['form-controls'] } ">
                            <div class="${ classesForms['form__text-control'] }">
                                <input class="${ classes['options__input'] }" id="inputSearch" type="search" name="input-search" placeholder="Search..." />
                                <label class="${ classes['options__label'] }" for="inputSearch">
                                    <span class="material-symbols notranslate">search</span>
                                </label>
                                <span class="${ classesForms['form__error-message'] }"></span>
                            </div>
                            <div class="${ classesForms['form__button-control'] }">
                                <button 
                                    id="buttonFilter" 
                                    class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">
                                    <span class="material-symbols notranslate">filter_list</span>
                                    Filters
                                </button>
                                <floating-vertical id="floatingVerticalFilter"></floating-vertical>
                            </div>
                            <div class="${ classesForms['form__button-control'] }">
                                <button 
                                    id="buttonVisibility" 
                                    class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">
                                    <span class="material-symbols notranslate">visibility</span>
                                </button>
                                <floating-vertical id="floatingVerticalVisibility"></floating-vertical>
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

                const floatingVerticalFilter = document.querySelector('#floatingVerticalFilter')
                floatingVerticalFilter.addContentElement({ title: 'Dimensions Range', element: this.#sectionScrollerDimensions() })

                const floatingVerticalVisibility = document.querySelector('#floatingVerticalVisibility')
                floatingVerticalVisibility.addContentElement({ title: 'Display Options', element: this.#sectionScrollerDisplayOptions() })
                floatingVerticalVisibility.addContentElement({ title: 'Sort By', element: this.#sectionScrollerSortBy() })

                enableBackMenu()
                this.addAllListeners()
            }
        }
    })