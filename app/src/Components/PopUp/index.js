import { createElementFromHTML } from '../../Common/common'
import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'

export default customElements.define('pop-up',
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            this.onClosePopupHandler = this.onClosePopupHandler.bind(this)

            this.state = {
                title: this.getAttribute('data-title') || 'Title',
                description: this.getAttribute('data-description') || 'Description',
                anchorLink: this.getAttribute('data-anchorlink') || '/',
                anchorText: this.getAttribute('data-anchortext') || 'Link',
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

        onClosePopupHandler(event) {
            this.querySelector(`.${ classes['wrapper-popup'] }`).classList.add(classes['wrapper-popup--disable'])
            setTimeout(() => this.remove(), 200)
        }

        removeEventsListener() {
            this.querySelector('#popupClose').removeEventListener('click', this.onClosePopupHandler)
            this.querySelector('#buttonClose').removeEventListener('click', this.onClosePopupHandler)
        }

        addEventsListener() {
            this.querySelector('#popupClose').addEventListener('click', this.onClosePopupHandler)
            this.querySelector('#buttonClose').addEventListener('click', this.onClosePopupHandler)
            this.querySelector('#anchorLink').addEventListener('click', () => {
                this.remove()
            })
        }

        #createdPopup({ title, description, anchorLink, anchorText }) {
            return(`
            <div class="${ classes['wrapper-popup'] } ${ classes['wrapper-popup--disable'] }">
                <div class="${ classes['popup'] }">
                    <div id="popupClose" class="${ classes['popup__header'] }">
                        <span class="material-symbols notranslate">close</span>
                    </div>
                    <h2>${ title }</h2>
                    <p>${ description }</p>
                    <div class="${ classes['popup__buttons'] }">
                        <a id="anchorLink" href="${ anchorLink }" class="${ classesForms['button'] } ${ classesForms['button__secondary'] }" data-link>${ anchorText }</a>
                        <button id="buttonClose" class="${ classesForms['button'] } ${ classesForms['button__primary'] }">Cancel</button>
                    </div>            
                </div>
                <div class="${ classes['wrapper__background'] }"></div>
            </div>
            `)
        }

        render() { 
            this.append(createElementFromHTML(this.#createdPopup({ 
                title: this.state.title, 
                description: this.state.description, 
                anchorLink: this.state.anchorLink, 
                anchorText: this.state.anchorText 
            })))
        
            setTimeout(() => this.querySelector(`.${ classes['wrapper-popup'] }`).classList.remove(classes['wrapper-popup--disable']))
            this.addEventsListener()
        }
    })