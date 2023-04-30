import { createElementFromHTML } from '../../Common/common'

import classes from './style.module.scss'

export default customElements.define('maze-block', 
    class extends HTMLElement {

        static get observedAttributes() { return ['type'] }

        constructor(...props) {
            super(props)

            this.onSelectedHandler = this.onSelectedHandler.bind(this)

            this.state = {
                items: window.editors,
                type: this.getAttribute('type') || window.editors.path.id,
                primaryButton: false,
                position: this.getAttribute('position'),
                overworldMazeEdit: document.querySelector('maze-edit').state.overworldMazeEdit,
                spriteVariantName: ''
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
                this.update()
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
            const changedValue = oldValue !== newValue

            if (changedValue) {
                const [ x, y ] = this.state.position.split(',').map(string => Number(string))
                const indexValuesX = [0, -1, +1, 0]
                const indexValuesY = [-1, 0, 0, +1]

                const positonsAround = []

                for (let i = 0; i < 4; i++) {
                    const aroundPosition = `${ x + indexValuesX[i] },${ y + indexValuesY[i] }`
                    positonsAround.push(aroundPosition)
                }
                const allBlocks = document.querySelectorAll('maze-block')
                const result = Array.from(allBlocks).filter(block => positonsAround.includes(block.getAttribute('position')))
                result.map(result => result.update())
            }
        }

        onSelectedHandler(event) {
            const newTypeKey = document.querySelector('blocks-toolbar').state.selectedItem

            if (newTypeKey == this.state.type) return

            const newType = this.state.items[newTypeKey]
            const [ x, y ] = this.state.position.split(',')

            if (newType && newType.type === 'Tile' && newTypeKey != this.state.type) {
                this.state.overworldMazeEdit.addTile({ x, y, typeName: newTypeKey })
                this.state = {
                    ...this.state,
                    type: newTypeKey
                }
                this.update()
                this.setAttribute('type', newTypeKey)
            }

            if (newType && newType.type === 'Object') {
                this.state.overworldMazeEdit.addTile({ x, y, typeName: this.state.items.path.id })
                this.state.overworldMazeEdit.setGameObject({ name: newTypeKey, x, y })
                
                this.state = {
                    ...this.state,
                    type: this.state.items.path.id,
                }
                this.update()
                this.setAttribute('type', this.state.items.path.id)

                const object = document.querySelector(`#${ newTypeKey }`)
                object.style.top = `${ (x - 1) * 64 }px`
                object.style.left = `${ (y - 1) * 64 }px`
            }
        }

        #createdBlocks() {
            return (`
                <div class="${ classes['block__content'] }">
                    <img src="" alt="">
                </div>
            `)
        }

        render() {
            this.append(createElementFromHTML(this.#createdBlocks()))
        }

        update() {
            if (!this.rendered) return

            const key = Object.keys(this.state.items).find((key, index) => this.state.items[key].id === this.state.type)
            const item = this.state.items[key]
            if (!item.sprite) return

            const amountOfVariants = Object.keys(item.sprite.variants).length
            var newSpriteVariantName
            if (amountOfVariants > 1) {
                const [ x, y ] = this.state.position.split(',').map(string => Number(string))
                const indexValuesX = [0, -1, +1, 0]
                const indexValuesY = [-1, 0, 0, +1]

                // typesAround[0] -> left
                // typesAround[1] -> top
                // typesAround[2] -> bottom
                // typesAround[3] -> right
                const typesAround = []
                const positonsAround = []

                for (let i = 0; i < 4; i++) {
                    const aroundPosition = `${ x + indexValuesX[i] },${ y + indexValuesY[i] }`
                    positonsAround.push(aroundPosition)
                    const aroundBlock = this.state.overworldMazeEdit.tilesMaze[aroundPosition]
                    if (aroundBlock) typesAround.push(aroundBlock)
                    else typesAround.push(this.state.items.air.id)
                }

                newSpriteVariantName = [item.getSpriteName(typesAround)]
            } else {
                newSpriteVariantName = Object.getOwnPropertyNames(item.sprite.variants)
            }   

            if (this.state.spriteVariantName != newSpriteVariantName[0]) {
                new Promise(async () => {
                    const imageElement = this.querySelector('img')
                    imageElement.src = await item.sprite.drawImage(newSpriteVariantName).then(image => image.src)
                    this.state.spriteVariantName = newSpriteVariantName
                })
            }
        }
    })