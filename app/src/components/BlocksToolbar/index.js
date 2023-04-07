import tag from '../../utils/tags'
import CustomCursor from '../../utils/CustomCursor'
import { createElementFromHTML, getDirectoryAssetsPath } from '../../utils/utils'

import styles from './style.module.scss'
const { locals: style } = styles

export default customElements.define('blocks-toolbar',
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            styles.use()

            this.onKeyDownHandler = this.onKeyDownHandler.bind(this)

            this.state = {
                items: tag.allowedTags(),
                selectedItem: -1
            }
        }

        async connectedCallback() {
            if (!this.rendered) {
                await this.render()
                this.rendered = true
                this.state.customCursor.initialize()
            }
        }

        disconnectedCallback() {
            this.removeEventsListener()
            this.state.customCursor.remove()
            delete this.state.customCursor
        }

        onKeyDownHandler(event) {
            switch (event.key) {
                case 'Escape':
                    event.preventDefault()
                    this.unselectedItemHadler()
                    break
            }
        }

        unselectedItemHadler() {
            if (this.state.selectedItem < 0) return

            const itemsToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)
            itemsToolbar[this.state.selectedItem].classList.remove(style['toolbar__item--selected'])
            this.state = { 
                ...this.state, 
                selectedItem: -1
            }

            this.state.customCursor.disable()
        }

        onSelectedItemHadler(event, key) {
            const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)

            if (this.state.selectedItem >= 0) 
                itemToolbar[this.state.selectedItem].classList.remove(style['toolbar__item--selected'])

            if (this.state.selectedItem != key) {
                this.state = { 
                    ...this.state, 
                    selectedItem: key
                }
    
                itemToolbar[this.state.selectedItem].classList.add(style['toolbar__item--selected'])
                this.state.customCursor.enable()

                const item = this.state.items[this.state.selectedItem]
                const cursorImage = this.querySelector(`.${ style.custom_cursor }`).querySelector('img')
                cursorImage.src = getDirectoryAssetsPath(item.icon, 'image')
            } else {
                this.state = { 
                    ...this.state, 
                    selectedItem: -1
                }
                this.state.customCursor.disable()
            }
        }

        addEventsListener() {
            const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)
            this.state.items.map((item, key) => {
                itemToolbar[key].addEventListener('click', event => {
                    this.onSelectedItemHadler(event, key)
                })
            })

            document.addEventListener('keydown', this.onKeyDownHandler)
        }

        removeEventsListener() {
            document.removeEventListener('keydown', this.onKeyDownHandler)
        }

        #createCursorItem() {
            return(`
                <div class="${ style.custom_cursor }">
                    <img src="" />
                </div>
            `)
        }

        #createBlocksToolbar() {
            return (`
                <div class="${ style.toolbar }">
                    ${
                        this.state.items.map((item, key) => {
                            const selectedItem = this.state.selectedItem
                            const isSelected = this.state.items.indexOf(item) === selectedItem
                            return this.#createItemsHandler(key, isSelected, item)
                        }).join('')
                    }
                </div>
            `)
        }

        #createItemsHandler(key, isSelected, item) {
            return (`
                <div
                    class="${ style.toolbar__item } ${ isSelected ? style['toolbar__item--selected'] : '' }"
                    key="${ key }"
                    role="button"
                    tabIndex="0"
                    title="${ item.label }"
                >
                    <img src="${ getDirectoryAssetsPath(item.icon, 'image') }" alt="${ item.id }">
                </div>
            `)
        }

        async render() {
            this.append(createElementFromHTML(this.#createBlocksToolbar()))
            this.appendChild(createElementFromHTML(this.#createCursorItem()))
            this.addEventsListener()

            this.state = {
                ...this.state,
                customCursor: new CustomCursor(`.${ style.custom_cursor }`, { 
                    disableClass: style['custom_cursor--disable'],
                    initializedClass: style['custom_cursor--initialized'],
                    focusElements: [ 'maze-blocks' ],
                    focusClass: style['custom_cursor--focused']
                })
            }
        }

        update() {
            
        }
    })