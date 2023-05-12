import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import validators from '../../Common/validators'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { checkToken } from "../../Common/common"

const TIME_SHOWING_MESSAGE = 1000
const MINIMUM_TIME_WAIT = 1000

export default customElements.define('register-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            if (checkToken(JSON.parse(sessionStorage.getItem('auth')))) window.location.href = `/`

            this.onRegisterHandler = this.onRegisterHandler.bind(this)
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

            this.removeEventsListener()
        }

        onRegisterHandler(event) {
            const targetClass = event.target.classList
            if (targetClass.contains(classesForms['button__submit--active']) || targetClass.contains(classesForms['button__submit--done']) || targetClass.contains(classesForms['button__submit--error'])) return

            const validatorInputEmail = validators(
                '#inputEmail', { formElement: '#formTextEmail', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            const validatorInputName = validators(
                '#inputUsername', { formElement: '#formTextName', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            
            const isValidEmail = validatorInputEmail.isValidNotEmpty() && validatorInputEmail.isValidEmail()
            const isValidUsername = validatorInputEmail.isValidNotEmpty() && validatorInputName.isValidNotSpecialCharacters()

            if (!isValidEmail || !isValidUsername) return

            const inputEmail = document.querySelector('#inputEmail')
            const inputUsername = document.querySelector('#inputUsername')

            targetClass.add(classesForms['button__submit--active'])
            Promise.all([new Promise(async (resolve, reject) => {
                try {
                    const response = await ConnectionAPI.RegisterUser(inputUsername.value, inputEmail.value)
                    if (response) {
                        const message = document.querySelector('message-info')
                        message.addMessageInfo({ description: `The registration was carried out successfully. A confirmation email has been sent to: ${ inputEmail.value }`, type: 'info' })
                        resolve()
                    }
                    else reject()
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
            const buttonRegister = document.querySelector('#buttonRegister')
            buttonRegister.addEventListener('click', this.onRegisterHandler)
        }

        removeEventsListener() {
            const buttonRegister = document.querySelector('#buttonRegister')
            buttonRegister.removeEventListener('click', this.onRegisterHandler)
        }

        render() {
            this.innerHTML = `
            <div class="${ classes['wrapper'] }">
                <h1>Get Started</h1>
                <p>Create your account now</p>

                <div class="${ classesForms['form-controls'] }">
                    <div id="formTextName" class="${ classesForms['form__text-control'] }">
                        <input type="text" name="inputUsername" id="inputUsername" placeholder=" " autocomplete="off" required />
                        <label for="inputUsername">Username</label>
                        <span class="${ classesForms['form__error-message'] }"></span>
                    </div>
                    <div id="formTextEmail" class="${ classesForms['form__text-control'] }">
                        <input type="text" name="inputEmail" id="inputEmail" placeholder=" " autocomplete="off" required />
                        <label for="inputEmail">Email</label>
                        <span class="${ classesForms['form__error-message'] }"></span>
                    </div>
                    <div class="${ classesForms['form__text-control'] }">
                        <button 
                            id="buttonRegister" 
                            class="${ classesForms['button'] } ${ classesForms['button__secondary'] } ${ classesForms['button__submit'] }">Sign Up</button>
                    </div>
                </div>

                <p class="caption">Have an account? <a class="land__link caption" href="/login" data-link>Sign In<a/></p>
            </div>
            `

            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')
            
            this.addEventsListener()
        }
    })