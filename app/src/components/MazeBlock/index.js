import { createElementFromHTML, getAroundBlocks } from '../../Common/common'

import classes from './style.module.scss'

export default customElements.define('maze-block', 
    class extends HTMLElement {

        static get observedAttributes() { return ['type'] }

        constructor(...props) {
            super(props)

            this.onSelectedHandler = this.onSelectedHandler.bind(this)
            this.onMouseOverHandler = this.onMouseOverHandler.bind(this)
            this.onMouseDownHandler = this.onMouseDownHandler.bind(this)
            this.onMouseUpHanler = this.onMouseUpHanler.bind(this)

            this.state = {
                items: window.editors,
                type: this.getAttribute('type') || window.editors.air.id,
                primaryButton: false,
                position: this.getAttribute('position'),
                overwolrdMazeEdit: document.querySelector('maze-edit').state.overwolrdMazeEdit
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
                this.update()
            }
        }

        onSelectedHandler(event) {
            const newTypeKey = document.querySelector('blocks-toolbar').state.selectedItem
            const newType = this.state.items[newTypeKey]
            const [ x, y ] = this.state.position.split(',')

            if (newType && newType.type === 'Tile' && newTypeKey != this.state.type) {
                this.state = {
                    ...this.state,
                    type: newTypeKey
                }
                this.setAttribute('type', newTypeKey)
                this.state.overwolrdMazeEdit.addTile({ x, y, typeName: newTypeKey })
            }

            if (newType && newType.type === 'Object') {
                this.state.overwolrdMazeEdit.addTile({ x, y, typeName: this.state.items.path.id })
                this.state.overwolrdMazeEdit.setGameObject({ name: newTypeKey, x, y })
                
                this.state = {
                    ...this.state,
                    type: this.state.items.path.id
                }
                this.setAttribute('type', this.state.items.path.id)
                this.state.overwolrdMazeEdit.addTile({ x, y, typeName: this.state.items.path.id })
            }
        }

        onMouseOverHandler(event) {
            if (this.state.primaryButton) this.onSelectedHandler(event)
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
                <div class="${ classes['block__content'] }">
                    <img src="" alt="">
                </div>
            `)
        }

        async render() {
            this.append(createElementFromHTML(this.#createdBlocks()))
            this.addEventsListener()
        }

        update() {
            const key = Object.keys(this.state.items).find((key, index) => this.state.items[key].id === this.state.type)
            const item = this.state.items[key]
            if (!item.sprite) return

            const amountOfVariants = Object.keys(item.sprite.variants).length
            
            if (amountOfVariants > 1) {
                
            } else {
                const imageElement = this.querySelector('img')

                const newSpriteName = Object.getOwnPropertyNames(item.sprite.variants)
                imageElement.src = item.sprite.drawImage(newSpriteName).src
            }   
        }
    })