import { createElementFromHTML } from '../../utils/utils'
import apiService from "../../services/api"

import styles from './style.module.scss'
const { locals: style } = styles

export default customElements.define('play-maze', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            styles.use()

            this.state = {
                maze: '',
                id: this.getAttribute('data-id'),
                encodedString: this.getAttribute('encodedString')
            }
        }

        async connectedCallback() {
            if (!this.rendered) {
                await this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            this.removeEventsListener()
        }

        addEventsListener() { }

        removeEventsListener() { }

        #createPage() {
            return (`
                <div class="${ style.wrapper_content }">
                    <editable-maze encoded-data="${ this.state.encodedString }"></editable-maze>
                </div>
            `)
        }

        async render() {
            this.append(createElementFromHTML(this.#createPage()))

            this.state = {
                ...this.state,
                maze: document.querySelector('editable-maze')
            }

            this.addEventsListener()
        }

        update() {
            if (!this.rendered) return
        }
    })