import classes from './style.module.scss'
import { checkToken } from "../../Common/common"
import ConnectionAPI from '../../Services/ConnectionAPI'

const TIME_SHOWING_MESSAGE = 1000
const MINIMUM_TIME_WAIT = 1000

export default customElements.define('register-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            const urlParams = new URLSearchParams(window.location.search)
            const userIdParam = urlParams.get('userId')
            const emailTokenParam = urlParams.get('emailToken')

            if (!userIdParam || !emailTokenParam) window.location.href = `/`
            if (checkToken(JSON.parse(sessionStorage.getItem('auth')))) window.location.href = `/`

            this.state = {
                userId: userIdParam,
                emailToken: emailTokenParam
            }
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
        }

        async render() {
            this.innerHTML = `
            <div class="${ classes['wrapper'] }">
                <h1>Verify email...</h1>
            </div>
            `

            const response = await ConnectionAPI.VerifyEmail(this.state.userId, this.state.emailToken)
            if (response) this.innerHTML += 'Success'
            else this.innerHTML += 'Error'
        }
    })