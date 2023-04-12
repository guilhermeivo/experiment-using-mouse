import classes from './style.module.scss'
import tags from '../../Common/tags'
import CustomCursor from '../../Common/CustomCursor'
import CheeseIcon from '../../assets/images/CheeseIcon.png'
import MouseIcon from '../../assets/images/MouseIcon.png'
import PathIcon from '../../assets/images/PathIcon.png'
import WallIcon from '../../assets/images/WallIcon.png'
import { createElementFromHTML } from '../../Common/common'

const images = { CheeseIcon, MouseIcon, PathIcon, WallIcon }

export default customElements.define('blocks-toolbar', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.state = {
                items: tags.allowedTags(),
                selectedItem: -1
            }

            this.onKeyDownHandler = this.onKeyDownHandler.bind(this)
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
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
                    this.unselectedItemHandler()
                    break
            }
        }

        unselectedItemHandler() {
            if (this.state.selectedItem < 0) return

            const itemsToolbar = this.querySelectorAll(`.${ classes['toolbar__item'] }`)
            itemsToolbar[this.state.selectedItem].classList.remove(classes['toolbar__item--selected'])
            this.state = { 
                ...this.state, 
                selectedItem: -1
            }

            this.state.customCursor.disable()
        }

        onSelectedItemHadler(event, key) {
            const itemToolbar = this.querySelectorAll(`.${ classes['toolbar__item'] }`)

            if (this.state.selectedItem >= 0) 
                itemToolbar[this.state.selectedItem].classList.remove(classes['toolbar__item--selected'])

            if (this.state.selectedItem != key) {
                this.state = { 
                    ...this.state, 
                    selectedItem: key
                }
    
                itemToolbar[this.state.selectedItem].classList.add(classes['toolbar__item--selected'])
                this.state.customCursor.enable()

                const item = this.state.items[this.state.selectedItem]
                const cursorImage = this.querySelector(`.${ classes['custom_cursor'] }`).querySelector('img')
                cursorImage.src = images[item.icon]
            } else {
                this.state = { 
                    ...this.state, 
                    selectedItem: -1
                }
                this.state.customCursor.disable()
            }
        }

        addEventsListener() {
            const itemToolbar = this.querySelectorAll(`.${ classes['toolbar__item'] }`)
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
                <div class="${ classes['custom_cursor'] }">
                    <img src="" />
                </div>
            `)
        }

        #createBlocksToolbar() {
            return (`
                <div class="${ classes['toolbar'] }">
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
                    class="${ classes['toolbar__item'] } ${ isSelected ? classes['toolbar__item--selected'] : '' }"
                    key="${ key }"
                    role="button"
                    tabIndex="0"
                    title="${ item.label }"
                >
                    <img src="${ images[item.icon] }" alt="${ item.id }">
                </div>
            `)
        }

        render() {
            this.append(createElementFromHTML(this.#createBlocksToolbar()))
            this.appendChild(createElementFromHTML(this.#createCursorItem()))
            this.addEventsListener()

            this.state = {
                ...this.state,
                customCursor: new CustomCursor(`.${ classes['custom_cursor'] }`, { 
                    disableClass: classes['custom_cursor--disable'],
                    initializedClass: classes['custom_cursor--initialized'],
                    focusElements: [ 'maze-blocks' ],
                    focusClass: classes['custom_cursor--focused']
                })
            }
            this.state.customCursor.initialize()
        }
    })