import { createElementFromHTML } from '../../Common/common'
import classes from './style.module.scss'

export default customElements.define('floating-vertical', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.state = {
                isOpen: false
            }

            this.onClickOutside = this.onClickOutside.bind(this)
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() { }

        onClickOutside(event) {
            event.preventDefault()
            if (this.state.isOpen && !this.contains(event.target)) {
                this.toggle()
            }
        }

        addContentElement({ title, element }) {
            this.querySelector('#floatingVertical').prepend(element)
            element.prepend(createElementFromHTML(`
                <div class="${ classes['floating-vertical__title'] }"><h4>${ title }</h4></div>
            `))
        }

        toggle() {
            this.querySelector('#floatingVertical').classList.toggle(classes['floating-vertical__disable']) 
            this.state = {
                ...this.state,
                isOpen: !this.querySelector('#floatingVertical').classList.contains(classes['floating-vertical__disable']) 
            }
            
            if (this.state.isOpen) {
                setTimeout(() => {
                    window.addEventListener('click', this.onClickOutside)
                }, 1)
            } else {
                window.removeEventListener('click', this.onClickOutside)
            }
        }

        render() {
            this.append(createElementFromHTML(`
                <div id="floatingVertical" class="${ classes['floating-vertical'] } ${ classes['floating-vertical__disable'] }"></div>
            `))
        }
    })