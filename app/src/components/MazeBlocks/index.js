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
            this.setDefaultValue = this.setDefaultValue.bind(this)

            this.state = {
                type: this.getAttribute('type') || tag.allowedTags()[0].id,
                maze: document.querySelector('editable-maze').state,
                spriteName: '',
                primaryButton: false
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
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
                document.querySelector('editable-maze').updateMazeHandler({
                    id: this.id,
                    type: this.state.type
                })            
            }
        }

        setDefaultValue() {
            this.state = {
                ...this.state,
                type: this.state.maze.tags[0].id,
            }
            this.update()
        }

        onSelectedHandler(event) {
            const newTypeIndex = document.querySelector('blocks-toolbar').state.selectedItem
            const newType = this.state.maze.tags[newTypeIndex]
            if (newTypeIndex >= 0 && newType.id != this.state.type) {
                this.state = {
                    ...this.state,
                    type: newType.id
                }

                this.update()
            }
        }

        removeEventsListener() {
            this.removeEventListener('click', this.onSelectedHandler)
        }

        addEventsListener() {
            this.addEventListener('click', this.onSelectedHandler)
            this.addEventListener('mouseover', () => {
                if (this.state.primaryButton) this.onSelectedHandler()
            })

            document.addEventListener('mousedown', () => this.state.primaryButton = true)
            document.addEventListener('mouseup', () => this.state.primaryButton = false)
        }

        #createBlocks() {
            return (`
                <div class="${ style.block__content }">
                    <img src="" alt="">
                </div>
            `)
        }

        render() {
            this.append(createElementFromHTML(this.#createBlocks()))
            this.addEventsListener()
        }

        update() {
            if (!this.rendered) return

            const imageElement = this.querySelector('img')
            this.setAttribute('type', this.state.type)
            const foundCurrentTag = this.state.maze.tags.find(value => value.id === this.state.type)

            const amountOfSprites = Object.keys(foundCurrentTag.sprite.sprites).length
            
            if (amountOfSprites == 1) {
                let newSpriteName = Object.getOwnPropertyNames(foundCurrentTag.sprite.sprites)
                if (this.state.spriteName != newSpriteName[0]) {
                    imageElement.src = foundCurrentTag.sprite.drawImage(newSpriteName).src
                    imageElement.alt = foundCurrentTag.id 

                    this.state.spriteName = newSpriteName
                }
            } else {
                const currentBlock = this.state.maze.blocks.find(block => block.id === this.id)
                let blocksAround = getAroundBlocks(this.state.maze.blocks, currentBlock.position)
                blocksAround = blocksAround.map(block => {
                    if (block) return block.type
                    else return 'void'
                })
                
                let newSpriteName = foundCurrentTag.getSpriteName(blocksAround)
                if (this.state.spriteName != newSpriteName) {
                    imageElement.src = foundCurrentTag.sprite.drawImage(newSpriteName).src
                    imageElement.alt = foundCurrentTag.id 

                    this.state.spriteName = newSpriteName
                }
            }
        }
    })