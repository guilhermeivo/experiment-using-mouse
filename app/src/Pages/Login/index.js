import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import validators from '../../Common/validators'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { checkToken } from "../../Common/common"

const TIME_SHOWING_MESSAGE = 1000
const MINIMUM_TIME_WAIT = 1000

export default customElements.define('login-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            if (checkToken(JSON.parse(sessionStorage.getItem('auth')))) window.location.href = `/`

            this.onLoginHandler = this.onLoginHandler.bind(this)
        }

        connectedCallback() {
            if (!this.rendered) {
                this.render()
                this.rendered = true
            }
        }

        disconnectedCallback() {
            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (!backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.add('back-menu--disabled')

            this.removeEventListener()
        }

        onLoginHandler(event) {
            const targetClass = event.target.classList
            if (targetClass.contains(classesForms['button__submit--active']) || targetClass.contains(classesForms['button__submit--done']) || targetClass.contains(classesForms['button__submit--error'])) return

            const validatorInputEmail = validators(
                '#inputEmail', { formElement: '#formTextEmail', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            
            const isValid = validatorInputEmail.isValidNotEmpty() && validatorInputEmail.isValidEmail()

            if (!isValid) return

            const inputEmail = document.querySelector('#inputEmail')

            targetClass.add(classesForms['button__submit--active'])
            Promise.all([new Promise(async (resolve, reject) => {
                try {
                    const response = await ConnectionAPI.LoginUser(inputEmail.value)

                    if (response) {
                        window.location.href = `/login/code?email=${ inputEmail.value }`
                        resolve()
                    } else reject()
                } catch (exception) {
                    reject()
                }
            }), new Promise(resolve => setTimeout(resolve, MINIMUM_TIME_WAIT))])
            .then(() => {
                targetClass.remove(classesForms['button__submit--active'])
                targetClass.add(classesForms['button__submit--done'])

                setTimeout(() => {
                    targetClass.remove(classesForms['button__submit--done'])
                }, TIME_SHOWING_MESSAGE)
            })
            .catch(() => {
                targetClass.remove(classesForms['button__submit--active'])
                targetClass.add(classesForms['button__submit--error'])

                setTimeout(() => {
                    targetClass.remove(classesForms['button__submit--error'])
                }, TIME_SHOWING_MESSAGE)
            })
        }

        addEventsListener() {
            const buttonLogin = document.querySelector('#buttonLogin')
            buttonLogin.addEventListener('click', this.onLoginHandler)
        }

        removeEventsListener() {
            const buttonLogin = document.querySelector('#buttonLogin')
            buttonLogin.removeEventListener('click', this.onLoginHandler)
        }

        render() {
            this.innerHTML = `
            <div class="${ classes['wrapper'] }">
                <h1>Welcome Back!</h1>
                <p>You must Sign in to join</p>

                <div class="${ classesForms['form-controls'] }">
                    <div id="formTextEmail" class="${ classesForms['form__text-control'] }">
                        <input type="text" name="inputEmail" id="inputEmail" placeholder=" " autocomplete="off" required />
                        <label for="inputEmail">Email</label>
                        <span class="${ classesForms['form__error-message'] }"></span>
                    </div>
                    <div class="${ classesForms['form__text-control'] }">
                        <button 
                            id="buttonLogin" 
                            class="${ classesForms['button'] } ${ classesForms['button__secondary'] } ${ classesForms['button__submit'] }">Sign Up</button>
                    </div>
                </div>

                <p class="caption">Don't have account? <a class="land__link caption" href="/register">Sign in<a/></p>
            </div>
            `

            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')

            this.addEventsListener()
        }
    })