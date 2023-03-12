import tag from '../../utils/tags'
import { createElementFromHTML } from '../../utils/utils.js'
import styles from './style.module.scss'
const { locals: style } = styles

const directorAssetsPath = window.location.origin + '/app/assets/'

const audio = {
    plungerImmediate: 'PlungerImmediate',

    loadAudio(filename) {
        const audio = document.querySelector(`#${ filename }`)
        audio.load()
        return audio
    },

    loadAudios() {
        if (typeof(this.plungerImmediate) == 'object') return

        this.plungerImmediate = this.loadAudio(this.plungerImmediate)
    } 
}

export default customElements.define('blocks-toolbar',
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            styles.use()

            this.keyDownHandler = this.keyDownHandler.bind(this)
            this.mouseMoveHandler = this.mouseMoveHandler.bind(this)

            this.state = {
                items: tag.allowedTags(),
                selectedItem: -1
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
                audio.loadAudios()
            }
        }

        disconnectedCallback() {
            this.removeEventsListener()
        }

        mouseMoveHandler(event) {
            if (this.state.selectedItem >= 0) {
                if (!document.querySelector(`.${ style.cursorItem }`))
                    this.append(createElementFromHTML(this.#createCursorItem(this.state.selectedItem)))

                const cursorItemSelected = document.querySelector(`.${ style.cursorItem }`)

                cursorItemSelected.style.transform = `
                    translate3d(
                        calc(${ event.clientX }px - 50%), 
                        calc(${ event.clientY }px - 50%), 
                        0)
                `

                if (cursorItemSelected.getAttribute('key') != this.state.selectedItem)
                    cursorItemSelected.remove()
            } else {
                if (document.querySelector(`.${ style.cursorItem }`))
                    document.querySelector(`.${ style.cursorItem }`).remove()
            }
        }

        keyDownHandler(event) {
            switch (event.key) {
                case 'Escape':
                    event.preventDefault()
                    this.onUnselectedItemHadler()
                    break
            }
        }

        onUnselectedItemHadler() {
            if (this.state.selectedItem >= 0) {
                const objectKeys = Object.keys(style)
                const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)
                itemToolbar[this.state.selectedItem].classList.remove(objectKeys.find(name => name === 'toolbar__item--selected'))
                this.state = { 
                    ...this.state, 
                    selectedItem: -1
                }

                const cursorItem = document.querySelector(`.${ style.cursorItem }`)
                if (cursorItem) cursorItem.remove()
            } 
        }

        onSelectedItemHadler(event, key) {
            const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)

            const objectKeys = Object.keys(style)
            if (this.state.selectedItem >= 0) 
                itemToolbar[this.state.selectedItem].classList.remove(objectKeys.find(name => name === 'toolbar__item--selected'))

            if (this.state.selectedItem != key) {
                this.state = { 
                    ...this.state, 
                    selectedItem: key
                }
    
                itemToolbar[this.state.selectedItem].classList.add(objectKeys.find(name => name === 'toolbar__item--selected'))
            } else {
                this.state = { 
                    ...this.state, 
                    selectedItem: -1
                }

                const cursorItem = document.querySelector(`.${ style.cursorItem }`)
                if (cursorItem) cursorItem.remove()
            }

            audio.plungerImmediate.play()
        }

        addEventsListener() {
            const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)
            this.state.items.map((item, key) => {
                itemToolbar[key].addEventListener('click', event => {
                    this.onSelectedItemHadler(event, key)
                })
            })

            document.addEventListener('keydown', this.keyDownHandler)
            document.addEventListener('mousemove', this.mouseMoveHandler)
        }

        removeEventsListener() {
            document.removeEventListener('keydown', this.keyDownHandler)
            document.removeEventListener('mousemove', this.mouseMoveHandler)
        }

        #createCursorItem(key) {
            return(`
                <div class="${ style.cursorItem }" key="${ key }">
                    ${(() => {
                        const item = this.state.items[key]
                        return (`
                            <img src="${ directorAssetsPath }${ item.icon }.png" alt="${ item.id }">
                        `)
                    })()}
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
            const objectKeys = Object.keys(style)
            return (`
                <div
                    class="${ style.toolbar__item } ${ isSelected ? objectKeys.find(name => name === 'toolbar__item--selected') : '' }"
                    key="${ key }"
                    role="button"
                    tabIndex="0"
                    title="${ item.label }"
                >
                    <img src="${ directorAssetsPath }${ item.icon }.png" alt="${ item.id }">
                </div>
            `)
        }

        render() {
            this.append(createElementFromHTML(this.#createBlocksToolbar()))
            this.addEventsListener()
        }
    })