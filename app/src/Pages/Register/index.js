import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import validatorForms from '../../Common/validatorForms'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { disableBackMenu, enableBackMenu, navigateTo, submitButtonHandler } from "../../Common/common"

export const PAGE_TAG = 'register-page'

export default customElements.define(PAGE_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onRegisterHandler = this.onRegisterHandler.bind(this)
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
        
        onRegisterHandler(event) {
            const validatorInputEmail = validatorForms(
                '#inputEmail', { formElement: '#formTextEmail', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            const validatorInputName = validatorForms(
                '#inputUsername', { formElement: '#formTextName', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            
            const isValidEmail = validatorInputEmail.isValidNotEmpty() && validatorInputEmail.isValidEmail()
            const isValidUsername = validatorInputEmail.isValidNotEmpty() && validatorInputName.isValidNotSpecialCharacters()

            if (!isValidEmail || !isValidUsername) return

            const inputEmail = document.querySelector('#inputEmail')
            const inputUsername = document.querySelector('#inputUsername')

            submitButtonHandler(
                event.target,
                async (resolve, reject) => {
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
                },
                () => navigateTo('/login')
            )
        }

        addAllListeners() {
            const buttonRegister = document.querySelector('#buttonRegister')
            buttonRegister.addEventListener('click', this.onRegisterHandler)
        }

        #createPage() {
            return (/*html*/`
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

                    <p class="caption">Have an account? <a class="land__link caption" href="/login" data-link>Sign In</a></p>
                </div>
            `)
        }

        render() {
            this.appendDOM(this.#createPage())

            enableBackMenu()            
            this.addAllListeners()
        }
    })