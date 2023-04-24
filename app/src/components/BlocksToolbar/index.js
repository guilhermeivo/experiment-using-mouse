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
                items: window.editors,
                selectedItem: null
            }

            this.onKeyDownHandler = this.onKeyDownHandler.bind(this)
            this.onSelectedItemHadler = this.onSelectedItemHadler.bind(this)
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
            if (!this.state.selectedItem) return

            const itemToolbar = [...this.querySelectorAll(`.${ classes['toolbar__item'] }`)]
            const currentItemToolbar = itemToolbar.find(value => value.getAttribute('key') === this.state.selectedItem)
            currentItemToolbar.classList.remove(classes['toolbar__item--selected'])
            this.state = { 
                ...this.state, 
                selectedItem: null
            }

            this.state.customCursor.disable()
        }

        onSelectedItemHadler(event) {
            const key = event.target.getAttribute('key')
            const item = this.state.items[key]
            const itemToolbar = [...this.querySelectorAll(`.${ classes['toolbar__item'] }`)]
            const lastItemToolbar = itemToolbar.find(value => value.getAttribute('key') === this.state.selectedItem)
            const currentItemToolbar = itemToolbar.find(value => value.getAttribute('key') === key)
            
            if (this.state.selectedItem) {
                lastItemToolbar.classList.remove(classes['toolbar__item--selected'])
            }

            if (this.state.selectedItem != key) {
                this.state = { 
                    ...this.state, 
                    selectedItem: key
                }
                
                const cursorImage = this.querySelector(`.${ classes['custom_cursor'] }`).querySelector('img')
                cursorImage.src = item.icon
                this.state.customCursor.enable()

                currentItemToolbar.classList.add(classes['toolbar__item--selected'])
                
            } else {
                this.state = { 
                    ...this.state, 
                    selectedItem: null
                }
                this.state.customCursor.disable()
            }
        }

        addEventsListener() {
            const itemToolbar = this.querySelectorAll(`.${ classes['toolbar__item'] }`)
            Object.keys(this.state.items).map((key, index) => {
                itemToolbar[index].addEventListener('click', this.onSelectedItemHadler)
            })

            document.addEventListener('keydown', this.onKeyDownHandler)
        }

        removeEventsListener() {
            const itemToolbar = this.querySelectorAll(`.${ classes['toolbar__item'] }`)
            Object.keys(this.state.items).map((key, index) => {
                itemToolbar[index].removeEventListener('click', this.onSelectedItemHadler)
            })

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
                        Object.keys(this.state.items).map((key, index) => {
                            const item = this.state.items[key]
                            const selectedItem = this.state.selectedItem
                            const isSelected = index === selectedItem
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
                    <img src="${ item.icon }" alt="${ item.label }">
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