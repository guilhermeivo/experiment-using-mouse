import { disableBackMenu, enableBackMenu } from '../../Common/common'
import classes from './style.module.scss'

export const PAGE_TAG = 'error-page'

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

        disconnectedCallback() {
            disableBackMenu()
        }

        #createPage() {
            return (/*html*/`
                <div class="${ classes['wrapper'] }">
                    <h1>Error</h1>
                </div>
            `)
        }

        render() {
            this.appendDOM(this.#createPage())

            enableBackMenu()
        }
    })