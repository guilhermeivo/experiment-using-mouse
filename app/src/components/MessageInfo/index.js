import { createElementFromHTML } from '../../Common/common'

import classes from './style.module.scss'

const MINIMUM_TIME_WAIT = 5000

export default customElements.define('message-info',
    class extends HTMLElement {
        
        constructor(...props) {
            super(props)

            this.onClickCloseHandler = this.onClickCloseHandler.bind(this)
        }

        async connectedCallback() {
            if (!this.rendered) {
                await this.render()
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
            return(`
            <div class="${ classes['message-info'] }">
                <div class="${ classes['type-info'] } ${ type == 'info' ? classes['type-info--info'] : classes['type-info--warn'] }">
                    ${
                        (type == 'info')
                            ? `<span class="material-symbols-outlined">
                                info
                               </span>`
                            : `<span class="material-symbols-outlined">
                                error
                               </span>`
                    }
                </div>
                <div class="${ classes['description-info'] }">
                    ${ description }
                </div>
                <div class="${ classes['close-button'] }">
                    <span class="material-symbols-outlined">
                    close
                    </span>
                </div>
            </div>
            `)
        }

        async render() {
            //this.append(createElementFromHTML(this.#createdListMessages()))
        }
    })