import tag from '../../utils/tags'
import { createElementFromHTML } from '../../utils/utils.js'
import styles from './style.module.scss'
const { locals: style } = styles

const directorAssetsPath = window.location.origin + '/app/assets/'

export default customElements.define('maze-blocks', 
    class extends HTMLElement {

        static get observedAttributes() { return ['type'] }

        constructor(...props) {
            super(props)

            styles.use()

            this.onClickHandler = this.onClickHandler.bind(this)
            this.setDefaultValue = this.setDefaultValue.bind(this)

            this.state = {
                type: this.getAttribute('type') || tag.allowedTags()[0].id,
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

        attributeChangedCallback(name, oldValue, newValue) {
            const changedValue = oldValue !== newValue

            if (changedValue) {
                document.querySelector('maze-construction').updateMazeHandler({
                    id: this.id,
                    type: this.state.type
                })            
            }
        }

        setDefaultValue() {
            this.state = {
                ...this.state,
                type: tag.allowedTags()[0].id,
            }

            this.update()
        }

        onClickHandler(event) {
            const newTypeIndex = document.querySelector('blocks-toolbar').state.selectedItem
            if (newTypeIndex >= 0) {
                const newType = tag.allowedTags()[newTypeIndex]

                this.state = {
                    ...this.state,
                    type: newType.id
                }

                this.update()
            }
        }

        removeEventsListener() {
            this.removeEventListener('click', this.onClickHandler)
        }

        addEventsListener() {
            this.addEventListener('click', this.onClickHandler)
        }

        #createBlocks() {
            const currentType = this.state.type
            const found = tag.allowedTags().find(value => value.id === currentType)

            return (`
                <div class="${ style.block__content }" type="">
                    <img src="${ directorAssetsPath }${ found.icon }.png" alt="${ found.id }">
                </div>
            `)
        }

        render() {
            this.append(createElementFromHTML(this.#createBlocks()))
            this.addEventsListener()
        }

        update() {
            if (this.rendered) {
                const currentType = this.state.type
                this.setAttribute('type', currentType)
                const found = tag.allowedTags().find(value => value.id === currentType)

                const imageElement = this.querySelector('img')
                imageElement.src = `${ directorAssetsPath }${ found.icon }.png`
            }
        }
    })