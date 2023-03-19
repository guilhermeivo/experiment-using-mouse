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
                maze: document.querySelector('editable-maze').state,
                spriteName: ''
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

        onClickHandler(event) {
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
            this.removeEventListener('click', this.onClickHandler)
        }

        addEventsListener() {
            this.addEventListener('click', this.onClickHandler)
        }

        #createBlocks() {
            return (`
                <div class="${ style.block__content }">
                    <img
                        src=""
                        alt="">
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
                const found = this.state.maze.tags.find(value => value.id === currentType)

                const imageElement = this.querySelector('img')
                let imageSrc = ''

                if (!found.sprite) return 

                const amountOfSprites = Object.keys(found.sprite.sprites).length
                let newSpritesName = Object.getOwnPropertyNames(found.sprite.sprites)
                
                if (amountOfSprites == 1 && this.state.spriteName != newSpritesName[0]) {
                    imageSrc = found.sprite.drawImage(newSpritesName).src
                    this.state.spriteName = newSpritesName
                } else {
                    if (found.getSpriteName) {
                        const convertToInt = (positions) => {
                            return positions.split(',').map(positionStr => Number(positionStr))
                        }
                        const getBlockWithPosition = (blocks, positions) => {
                            return blocks.find(block => block.position === positions.join(','))
                        }
                        const currentPosition = convertToInt(this.state.maze.blocks.find(block => block.id === this.id).position)
                        const indexValuesX = [0, -1, +1, 0]
                        const indexValuesY = [-1, 0, 0, +1]
                        let blocksUpcoming = []
                        for (let i = 0; i < 4; i++) {
                            const newPositionBlock = getBlockWithPosition(
                                this.state.maze.blocks,
                                [currentPosition[0] + indexValuesX[i], currentPosition[1] + indexValuesY[i]])
                            if (newPositionBlock)
                                blocksUpcoming.push(newPositionBlock.type)
                            else 
                                blocksUpcoming.push('void')
                        }
                        newSpritesName = found.getSpriteName(blocksUpcoming)

                        if (this.state.spriteName != newSpritesName) {
                            imageSrc = found.sprite.drawImage(newSpritesName).src
                            this.state.spriteName = newSpritesName
                        }
                    }
                }
                
                if (imageSrc == '') return
                
                imageElement.src = imageSrc
                imageElement.alt = found.id
            }
        }
    })