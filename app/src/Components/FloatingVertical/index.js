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
            const elementDOM = this.querySelector(`.${ classes['floating-vertical'] }`).appendDOM(element)
            elementDOM.appendDOM(`
                <div class="${ classes['floating-vertical__title'] }">
                    <h4>${ title }</h4>
                </div>
            `, 'afterbegin')
        }

        onEscapeHandler(event) {
            event.preventDefault()
            if (this.state.isOpen) this.toggle()
        }

        toggle() {
            const floatingVertical = this.querySelector(`.${ classes['floating-vertical'] }`)
            floatingVertical.classList.toggle(classes['floating-vertical__disable']) 
            this.state = {
                ...this.state,
                isOpen: !floatingVertical.classList.contains(classes['floating-vertical__disable']) 
            }

            if (this.state.isOpen) {
                let allFloatingVertical = Array.from(document.querySelectorAll(`.${ classes['floating-vertical'] }`))
                allFloatingVertical = allFloatingVertical.filter(item => item !== floatingVertical)

                allFloatingVertical.forEach(item => {
                    if (item.parentElement.state.isOpen) item.parentElement.toggle()
                })
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
                <div class="${ classes['floating-vertical'] } ${ classes['floating-vertical__disable'] }"></div>
            `)

            this.addAllListeners()
        }
    })