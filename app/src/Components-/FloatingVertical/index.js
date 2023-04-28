import { createElementFromHTML } from '../../Common/common'

import classes from './style.module.scss'

export default customElements.define('floating-vertical', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onKeyDownHandler = this.onKeyDownHandler.bind(this)

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
            this.removeEventsListener()
        }

        addContentElement({ title, element }) {
            this.querySelector('#floatingVertical').prepend(element)
            element.prepend(createElementFromHTML(`
                <div class="${ classes['floating-vertical__title'] }">
                    <h4>${ title }</h4>
                </div>
            `))
        }

        onKeyDownHandler(event) {
            switch (event.key) {
                case 'Escape':
                    event.preventDefault()
                    if (this.state.isOpen) this.toggle()
                    break
                case 'e':
                    if (!this.state.isOpen) {
                        event.preventDefault()
                        this.toggle()
                    }
                    break
            }
        }

        toggle() {
            const floatingVertical = this.querySelector('#floatingVertical')
            floatingVertical.classList.toggle(classes['floating-vertical__disable']) 
            this.state = {
                ...this.state,
                isOpen: !floatingVertical.classList.contains(classes['floating-vertical__disable']) 
            }
        }

        addEventsListener() {
            document.addEventListener('keydown', this.onKeyDownHandler)
        }

        removeEventsListener() {
            document.removeEventListener('keydown', this.onKeyDownHandler)
        }

        render() {
            this.append(createElementFromHTML(`
                <div 
                    id="floatingVertical" 
                    class="${ classes['floating-vertical'] } ${ classes['floating-vertical__disable'] }"></div>
            `))

            this.addEventsListener()
        }
    })