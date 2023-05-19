import { disableBackMenu } from '../../Common/common'

import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'

export const PAGE_TAG = 'home-page'

export default customElements.define(PAGE_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        #createPage() {
            return (/*html*/`
                <div class="${ classes['wrapper'] }">
                    <h1>Experiment Using Mouse 🖱️</h1>
                    <div class="${ classesForms['form-controls'] } ${ classes['flex'] }">
                        <div class="${ classesForms['form__button-control'] }">
                            <a href="/make" class="${ classesForms['button'] } ${ classesForms['button__secondary'] }" data-link>Make</a>
                        </div>
                        <div class="${ classesForms['form__button-control'] }">
                            <a href="/play" class="${ classesForms['button'] } ${ classesForms['button__primary'] }" data-link>Play</a>
                        </div>
                    </div>
                </div>

                <div class="${ classes['background'] } ${ classes['background--1'] }">
                    <div class="${ classes['background__orb'] }"></div>
                </div>

                <div class="${ classes['background'] } ${ classes['background--2'] }">
                    <div class="${ classes['background__orb'] }"></div>
                </div>
            `)
        }

        render() {
            this.appendDOM(this.#createPage())
            
            disableBackMenu()
        }
    })