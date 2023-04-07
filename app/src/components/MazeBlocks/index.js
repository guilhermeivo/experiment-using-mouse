import tag from '../../utils/tags'
import { createElementFromHTML, getAroundBlocks } from '../../utils/utils'

import styles from './style.module.scss'
const { locals: style } = styles

export default customElements.define('maze-blocks', 
    class extends HTMLElement {

        static get observedAttributes() { return ['type'] }

        constructor(...props) {
            super(props)

            styles.use()

            this.onSelectedHandler = this.onSelectedHandler.bind(this)
            this.onMouseOverHandler = this.onMouseOverHandler.bind(this)
            this.onMouseDownHandler = this.onMouseDownHandler.bind(this)
            this.onMouseUpHanler = this.onMouseUpHanler.bind(this)

            this.state = {
                type: this.getAttribute('type') || tag.allowedTags()[0].id,
                maze: document.querySelector('editable-maze'),
                spriteName: '',
                primaryButton: false
            }
        }

        async connectedCallback() {
            if (!this.rendered) {
                await this.render()
                this.rendered = true
                this.update()
            }
        }

        disconnectedCallback() {
            this.removeEventsListener()
        }

        attributeChangedCallback(name, oldValue, newValue) {
            const changedValue = oldValue !== newValue

            if (changedValue) {
                this.state.maze.updateMazeHandler({
                    id: this.id,
                    type: this.state.type
                })            
            }
        }

        setDefaultValue() {
            this.state = {
                ...this.state,
                type: this.state.maze.state.tags[0].id,
            }
            this.update()
        }

        onSelectedHandler(event) {
            const newTypeIndex = document.querySelector('blocks-toolbar').state.selectedItem
            const newType = this.state.maze.state.tags[newTypeIndex]
            if (newTypeIndex >= 0 && newType.id != this.state.type) {
                this.state = {
                    ...this.state,
                    type: newType.id
                }
                this.update()
            }
        }

        onMouseOverHandler(event) {
            if (this.state.primaryButton) this.onSelectedHandler()
        }

        onMouseDownHandler(event) {
            this.state.primaryButton = true
        }

        onMouseUpHanler(event) {
            this.state.primaryButton = false
        }

        addEventsListener() {
            this.addEventListener('click', this.onSelectedHandler)
            this.addEventListener('mouseover', this.onMouseOverHandler)
            document.addEventListener('mousedown', this.onMouseDownHandler)
            document.addEventListener('mouseup', this.onMouseUpHanler)
        }

        removeEventsListener() {
            this.removeEventListener('click', this.onSelectedHandler)
            this.removeEventListener('mouseover', this.onMouseOverHandler)
            document.removeEventListener('mousedown', this.onMouseDownHandler)
            document.removeEventListener('mouseup', this.onMouseUpHanler)
        }

        #createdBlocks() {
            return (`
                <div class="${ style.block__content }">
                    <img src="" alt="">
                </div>
            `)
        }

        async render() {
            this.append(createElementFromHTML(this.#createdBlocks()))
            this.addEventsListener()
        }

        update() {
            if (!this.rendered) return

            const stateMaze = this.state.maze.state
            const foundCurrentTag = stateMaze.tags.find(value => value.id === this.state.type)
            const amountOfSprites = Object.keys(foundCurrentTag.sprite.sprites).length
            let newSpriteName

            if (amountOfSprites > 1) {
                const currentBlock = stateMaze.blocks.find(block => block.id === this.id)
                let blocksAround = getAroundBlocks(stateMaze.blocks, currentBlock.position)
                blocksAround = blocksAround.map(block => block ? block.type : 'void')
                newSpriteName = [foundCurrentTag.getSpriteName(blocksAround)]
            } else {
                newSpriteName = Object.getOwnPropertyNames(foundCurrentTag.sprite.sprites)
            }

            if (this.state.spriteName != newSpriteName[0]) {
                const imageElement = this.querySelector('img')

                this.setAttribute('type', this.state.type)
                imageElement.src = foundCurrentTag.sprite.drawImage(newSpriteName).src
                imageElement.alt = foundCurrentTag.id 

                this.state.spriteName = newSpriteName
            }
        }
    })