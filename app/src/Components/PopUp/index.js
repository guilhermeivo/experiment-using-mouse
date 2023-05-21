import { createElementFromHTML } from '../../Common/common'
import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'

export const COMPONENT_TAG = 'pop-up'

export default customElements.define('pop-up',
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            this.onClosePopupHandler = this.onClosePopupHandler.bind(this)

            const anchorLink = this.getAttribute('data-anchorlink')
            const anchorText = this.getAttribute('data-anchortext')

            this.state = {
                title: this.getAttribute('data-title') || 'Title',
                description: this.getAttribute('data-description') || 'Description',
                anchorLink: (anchorLink.includes(',') ? anchorLink.split(',') : anchorLink) || '/',
                anchorText: (anchorText.includes(',') ? anchorText.split(',') : anchorText) || 'Link',
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

        onClosePopupHandler(event) {
            this.querySelector(`.${ classes['wrapper-popup'] }`).classList.add(classes['wrapper-popup--disable'])
            setTimeout(() => this.remove(), 200)
        }

        addAllListeners() {
            this.querySelector('#popupClose').addEventListener('click', this.onClosePopupHandler)
            if (this.querySelector('#buttonClose')) this.querySelector('#buttonClose').addEventListener('click', this.onClosePopupHandler)
            this.querySelectorAll('a').forEach(a => a.addEventListener('click', () => this.remove()))
        }

        removeAllListeners() {
            this.querySelector('#popupClose').removeEventListener('click', this.onClosePopupHandler)
            if (this.querySelector('#buttonClose')) this.querySelector('#buttonClose').removeEventListener('click', this.onClosePopupHandler)
        }

        #createdPopup({ title, description, anchorLink, anchorText }) {
            return(/*html*/`
                <div class="${ classes['wrapper-popup'] }">
                    <div class="${ classes['popup'] }">
                        <div id="popupClose" class="${ classes['popup__header'] }">
                            <span class="material-symbols notranslate">close</span>
                        </div>
                        <h2>${ title }</h2>
                        <p>${ description }</p>
                        <div class="${ classes['popup__buttons'] }">
                        ${
                            typeof anchorLink === 'object'
                            ? `
                            <a href="${ anchorLink[0] }" class="${ classesForms['button'] } ${ classesForms['button__secondary'] }" data-link>${ anchorText[0] }</a>
                            <a href="${ anchorLink[1] }" class="${ classesForms['button'] } ${ classesForms['button__primary'] }" data-link>${ anchorText[1] }</a>`
                            : `
                            <a href="${ anchorLink }" class="${ classesForms['button'] } ${ classesForms['button__secondary'] }" data-link>${ anchorText }</a>
                            <button id="buttonClose" class="${ classesForms['button'] } ${ classesForms['button__primary'] }">Cancel</button>`
                        }
                        </div>            
                    </div>
                    <div class="${ classes['wrapper__background'] }"></div>
                </div>
            `)
        }

        render() { 
            this.appendDOM(this.#createdPopup({ 
                title: this.state.title, 
                description: this.state.description, 
                anchorLink: this.state.anchorLink, 
                anchorText: this.state.anchorText 
            }))

            this.addAllListeners()
        }
    })