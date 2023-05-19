import classes from './style.module.scss'
import { checkToken, navigateTo } from "../../Common/common"
import ConnectionAPI from '../../Services/ConnectionAPI'

export const PAGE_TAG = 'verify-page'

export default customElements.define(PAGE_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            if (!window.getParameterUrl('userId') || !window.getParameterUrl('emailToken')) history.back()

            this.state = {
                userId: window.getParameterUrl('userId'),
                emailToken: window.getParameterUrl('emailToken')
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        async verifyEmailHandler() {
            const response = await ConnectionAPI.VerifyEmail(this.state.userId, this.state.emailToken)
            if (response) {
                const message = document.querySelector('message-info')
                message.addMessageInfo({ description: `Email and registration confirmed successfully.`, type: 'info' })
                navigateTo('/login')
            } else {
                navigateTo(`/`)
            }
        }
        
        #createPage() {
            return (/*html*/`
                <div class="${ classes['wrapper'] }">
                    <h1>Verify email...</h1>
                </div>
            `)
        }

        render() {
            this.appendDOM(this.#createPage())

            this.verifyEmailHandler()
        }
    })