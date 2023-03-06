import tag from './tags.js'
import styles from './style.module.scss'
const { locals: style } = styles

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
                if (!document.querySelector(`.${ style.cursorItem }`)) {
                    const element = document.createElement('div')
                    element.innerHTML = this.#createCursorItem(this.state.selectedItem)
                    this.append(element)
                }

                const cursorItemSelected = document.querySelector(`.${ style.cursorItem }`)

                let x = event.clientX
                let y = event.clientY
                cursorItemSelected.style.transform = `translate3d(calc(${ x }px - 50%), calc(${ y }px - 50%), 0)`

                if (cursorItemSelected.getAttribute('key') != this.state.selectedItem)
                    cursorItemSelected.parentElement.remove()
            } else {
                if (document.querySelector(`.${ style.cursorItem }`))
                    document.querySelector(`.${ style.cursorItem }`).parentElement.remove()
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
                const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)
                itemToolbar[this.state.selectedItem].classList.remove('toolbar__item--selected')
                this.state = { 
                    ...this.state, 
                    selectedItem: -1
                }

                if (document.querySelector(`.${ style.cursorItem }`))
                    document.querySelector(`.${ style.cursorItem }`).parentElement.remove()
            } 
        }

        onSelectedItemHadler(event, key) {
            const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)
            const itemSelected = itemToolbar[key]

            if (this.state.selectedItem >= 0)
                itemToolbar[this.state.selectedItem].classList.remove('toolbar__item--selected')

            this.state = { 
                ...this.state, 
                selectedItem: itemSelected.getAttribute('key')
            }

            itemToolbar[this.state.selectedItem].classList.add('toolbar__item--selected')

            audio.plungerImmediate.play()
        }

        addEventsListener() {
            const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)

            this.state.items.map((item, key) => {
                itemToolbar[key].addEventListener('click', (event) => {
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
            const directorPath = window.location.origin + '/app/assets/'

            return(`
                <div class="${ style.cursorItem }" key="${ key }">
                    ${(() => {
                        const item = this.state.items[key]
                        return (`
                            <img src="${ directorPath }${ item.icon }.png" alt="${ item.id }">
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
            const directorPath = window.location.origin + '/app/assets/'

            return (`
                <div
                    class="${ style.toolbar__item } ${ isSelected ? 'toolbar__item--selected' : '' }"
                    key="${ key }"
                    role="button"
                    tabIndex="0",
                    title="${ item.label }"
                >
                    <img src="${ directorPath }${ item.icon }.png" alt="${ item.id }">
                </div>
            `)
        }

        render() {
            const element = document.createElement('div')
            element.innerHTML = this.#createBlocksToolbar()
            this.append(element)

            this.addEventsListener()
        }
    })
