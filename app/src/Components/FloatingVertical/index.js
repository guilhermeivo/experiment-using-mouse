import { createElementFromHTML } from '../../Common/common'
import KeyPressListener from '../../Common/KeyPressListener'

import classes from './style.module.scss'

export const COMPONENT_TAG = 'floating-vertical'

export default customElements.define(COMPONENT_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onEscapeHandler = this.onEscapeHandler.bind(this)

            this.state = {
                isOpen: false
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() { 
            this.removeAllListeners()
        }

        addContentElement({ title, element }) {
            this.querySelector('#floatingVertical').prepend(element)
            element.prepend(createElementFromHTML(`
                <div class="${ classes['floating-vertical__title'] }">
                    <h4>${ title }</h4>
                </div>
            `))
        }

        onEscapeHandler(event) {
            event.preventDefault()
            if (this.state.isOpen) this.toggle()
        }

        toggle() {
            const floatingVertical = this.querySelector('#floatingVertical')
            floatingVertical.classList.toggle(classes['floating-vertical__disable']) 
            this.state = {
                ...this.state,
                isOpen: !floatingVertical.classList.contains(classes['floating-vertical__disable']) 
            }
        }

        addAllListeners() {
            this.escapeKeyPress = new KeyPressListener('Escape', this.onEscapeHandler)
        }

        removeAllListeners() {
            this.escapeKeyPress.unbind()
            delete this.escapeKeyPress
        }

        render() {
            this.appendDOM(`
                <div 
                    id="floatingVertical" 
                    class="${ classes['floating-vertical'] } ${ classes['floating-vertical__disable'] }"></div>
            `)

            this.addAllListeners()
        }
    })