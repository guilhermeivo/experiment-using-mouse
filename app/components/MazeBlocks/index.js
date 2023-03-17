import tag from '../../utils/tags'
import { createElementFromHTML, getDirectoryAssetsPath } from '../../utils/utils.js'
import styles from './style.module.scss'
const { locals: style } = styles

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
                maze: document.querySelector('editable-maze')
            }
        }

        async connectedCallback() {
            if (!this.rendered) {
                await this.render()
                this.rendered = true
                
                await this.state.maze.state.sprite.initialize()
                this.update()
            }
        }

        disconnectedCallback() {
            this.removeEventsListener()
        }

        attributeChangedCallback(name, oldValue, newValue) {
            const changedValue = oldValue !== newValue

            if (changedValue) {
                document.querySelector('editable-maze').updateMazeHandler({
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
            return (`
                <div class="${ style.block__content }" type="">
                    <img
                        src=""
                        alt="">
                </div>
            `)
        }

        async render() {
            await this.append(createElementFromHTML(this.#createBlocks()))
            this.addEventsListener()
        }

        update() {
            if (this.rendered) {
                const currentType = this.state.type
                this.setAttribute('type', currentType)
                const found = tag.allowedTags().find(value => value.id === currentType)
                const maze = document.querySelector('editable-maze')

                const imageElement = this.querySelector('img')
                let imageSrc

                if (found.id === 'path') {
                    imageSrc =  this.state.maze.state.sprite.drawImage('grass-variants').src
                } else if (found.id === 'wall') {
                    imageSrc =  this.state.maze.state.sprite.drawImage('edge-center').src
                } else {
                    imageSrc = getDirectoryAssetsPath(found.icon, 'image')
                }
                
                imageElement.src = imageSrc
                imageElement.alt = found.id
            }
        }
    })