import CustomCursor from '../../Common/CustomCursor'
import { createElementFromHTML } from '../../Common/common'
import KeyPressListener from '../../Common/KeyPressListener'

import classes from './style.module.scss';

export const COMPONENT_TAG = 'blocks-toolbar'

export default customElements.define(COMPONENT_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onClickedItemHadler = this.onClickedItemHadler.bind(this)
            this.onEscapeKeyPress = this.onEscapeKeyPress.bind(this)
            this.onNumberKeyPress = this.onNumberKeyPress.bind(this)

            this.state = {
                items: window.editors,
                selectedItem: null,
                customCursor: new CustomCursor(`.${ classes['custom_cursor'] }`, { 
                    disableClass: classes['custom_cursor--disable'],
                    initializedClass: classes['custom_cursor--initialized'],
                    focusElements: [ 'maze-block' ],
                    focusClass: classes['custom_cursor--focused']
                })
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            this.removeAllListeners()
            this.state.customCursor.remove()
            delete this.state.customCursor
        }

        selectedItemHadler(key) {
            const item = this.state.items[key]
            const itemToolbar = [...this.querySelectorAll(`.${ classes['toolbar__item'] }`)]
            const lastItemToolbar = itemToolbar.find(value => value.getAttribute('key') === this.state.selectedItem)
            const currentItemToolbar = itemToolbar.find(value => value.getAttribute('key') === key)
            
            if (this.state.selectedItem)
                lastItemToolbar.classList.remove(classes['toolbar__item--selected'])

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
                this.unselectedItemHandler()
            }
        }

        unselectedItemHandler() {
            if (!this.state.selectedItem) return

            const itemToolbar = [...this.querySelectorAll(`.${ classes['toolbar__item'] }`)]
            const currentItemToolbar = itemToolbar.find(value => value.getAttribute('key') === this.state.selectedItem)
            if (currentItemToolbar.classList.contains(classes['toolbar__item--selected']))
                currentItemToolbar.classList.remove(classes['toolbar__item--selected'])
            this.state = { 
                ...this.state, 
                selectedItem: null
            }

            this.state.customCursor.disable()
        }

        onClickedItemHadler(event) {
            const key = event.target.getAttribute('key')
            this.selectedItemHadler(key)
        }

        onEscapeKeyPress(event) {
            if (this.state.selectedItem)
                this.selectedItemHadler(this.state.selectedItem)
        }

        onNumberKeyPress(event) {
            const key = Object.keys(this.state.items)[event.key - 1]
            this.selectedItemHadler(key)
        }

        addAllListeners() {
            const itemToolbar = this.querySelectorAll(`.${ classes['toolbar__item'] }`)
            Object.keys(this.state.items).map((key, index) => {
                itemToolbar[index].addEventListener('click', this.onClickedItemHadler)
            })

            this.escapeKeyPress = new KeyPressListener('Escape', this.onEscapeKeyPress)

            const keys = Object.keys(itemToolbar).map((key, index) => `${ index + 1 }`)
            this.numberKeyPress = new KeyPressListener(keys, this.onNumberKeyPress)
        }

        removeAllListeners() {
            const itemToolbar = this.querySelectorAll(`.${ classes['toolbar__item'] }`)
            Object.keys(this.state.items).map((key, index) => {
                itemToolbar[index].removeEventListener('click', this.onClickedItemHadler)
            })

            this.escapeKeyPress.unbind()
            delete this.escapeKeyPress
            this.numberKeyPress.unbind()
            delete this.numberKeyPress
        }

        #createCursorItem() {
            return(`
                <div class="${ classes['custom_cursor'] }">
                    <img src="" />
                </div>
            `)
        }

        #createBlocksToolbar() {
            return (/*html*/`
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
            return (/*html*/`
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
            this.appendDOM(this.#createBlocksToolbar())
            this.appendDOM(this.#createCursorItem())

            this.state.customCursor.initialize()

            this.addAllListeners()
        }
    })