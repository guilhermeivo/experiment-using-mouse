import CustomCursor from '../../Common/CustomCursor'
import { createElementFromHTML } from '../../Common/common'

import classes from './style.module.scss';

export default customElements.define('blocks-toolbar', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.state = {
                items: window.editors,
                selectedItem: null
            }

            this.onKeyDownHandler = this.onKeyDownHandler.bind(this)
            this.onClickedItemHadler = this.onClickedItemHadler.bind(this)
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
                    if (this.state.selectedItem)
                        this.selectedItemHadler(this.state.selectedItem)                        
                    break
            }

            /*const eventKeyNumber = Number(event.key - 1)
            if (typeof eventKeyNumber === 'number' && !Number.isNaN(eventKeyNumber)) {
                const amountEditors = Object.keys(this.state.items).length
                if (eventKeyNumber >= 0 && eventKeyNumber < amountEditors) {
                    const key = Object.keys(this.state.items)[eventKeyNumber]
                    this.selectedItemHadler(key)
                }
            }*/
        }

        selectedItemHadler(key) {
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

        addEventsListener() {
            const itemToolbar = this.querySelectorAll(`.${ classes['toolbar__item'] }`)
            Object.keys(this.state.items).map((key, index) => {
                itemToolbar[index].addEventListener('click', this.onClickedItemHadler)
            })

            document.addEventListener('keydown', this.onKeyDownHandler)
        }

        removeEventsListener() {
            const itemToolbar = this.querySelectorAll(`.${ classes['toolbar__item'] }`)
            Object.keys(this.state.items).map((key, index) => {
                itemToolbar[index].removeEventListener('click', this.onClickedItemHadler)
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

            this.state = {
                ...this.state,
                customCursor: new CustomCursor(`.${ classes['custom_cursor'] }`, { 
                    disableClass: classes['custom_cursor--disable'],
                    initializedClass: classes['custom_cursor--initialized'],
                    focusElements: [ 'maze-block' ],
                    focusClass: classes['custom_cursor--focused']
                })
            }
            this.state.customCursor.initialize()

            this.addEventsListener()
        }
    })