import { createElementFromHTML } from '../../Common/common'

import classes from './style.module.scss'

const MINIMUM_TIME_WAIT = 5000

export const COMPONENT_TAG = 'message-info'

export default customElements.define(COMPONENT_TAG,
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            this.onClickCloseHandler = this.onClickCloseHandler.bind(this)
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
        }

        onClickCloseHandler(event) {
            const message = event.target.parentElement.parentElement
            message.classList.add(classes['message-info__remove'])
            setTimeout(() => {
                message.remove()
            }, 300)
        }

        addMessageInfo({ description, type }) {
            const message = createElementFromHTML(this.#createdMessage({ description, type }))
            this.append(message)
            message.querySelector(`.${ classes['close-button'] }`).addEventListener('click', this.onClickCloseHandler)
            setTimeout(() => {
                message.classList.add(classes['message-info__remove'])
                setTimeout(() => {
                    message.remove()
                }, 800)
            }, MINIMUM_TIME_WAIT)
        }

        #createdMessage({ description, type }) {
            return(/*html*/`
                <div class="${ classes['message-info'] } ${ type == 'info' ? classes['message-info--info'] : classes['message-info--warn'] }">
                    <div class="${ classes['type-info'] }">
                        ${
                            (type == 'info')
                                ? `<span class="material-symbols notranslate">
                                    info
                                </span>`
                                : `<span class="material-symbols notranslate">
                                    error
                                </span>`
                        }
                    </div>
                    <div class="${ classes['description-info'] }" title="${ description }">
                        ${ description }
                    </div>
                    <div class="${ classes['close-button'] }">
                        <span class="material-symbols notranslate">
                        close
                        </span>
                    </div>
                </div>
            `)
        }

        render() { }
    })