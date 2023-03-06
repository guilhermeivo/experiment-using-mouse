import tag from './tags.js'
import styles from './style.module.scss'
const { locals: style } = styles

export default customElements.define('blocks-toolbar',
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            styles.use()

            this.keyDownHandler = this.keyDownHandler.bind(this)

            this.state = {
                items: tag.allowedTags(),
                selectedItem: -1
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            this.removeEventsListener()
        }

        keyDownHandler(event) {
            switch (event.key) {
                case 'Escape':
                    event.preventDefault()
                    if(this.state.selectedItem >= 0) {
                        const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)
                        itemToolbar[this.state.selectedItem].classList.remove('toolbar__item--selected')
                        this.state = { 
                            ...this.state, 
                            selectedItem: -1
                        }
                    }
                    break
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
        }

        addEventsListener() {
            const itemToolbar = this.querySelectorAll(`.${ style.toolbar__item }`)

            this.state.items.map((item, key) => {
                itemToolbar[key].addEventListener('click', (event) => {
                    this.onSelectedItemHadler(event, key)
                })
            })

            document.addEventListener('keydown', this.keyDownHandler)
        }

        removeEventsListener() {
            document.removeEventListener('keydown', this.keyDownHandler)
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
