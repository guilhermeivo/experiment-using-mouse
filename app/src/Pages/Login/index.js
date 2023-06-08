import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import validatorForms from '../../Common/validatorForms'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { disableBackMenu, enableBackMenu, navigateTo, submitButtonHandler } from "../../Common/common"

export const PAGE_TAG = 'login-page'

export default customElements.define(PAGE_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onLoginHandler = this.onLoginHandler.bind(this)
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

        onLoginHandler(event) {
            const validatorInputEmail = validatorForms(
                '#inputEmail', { formElement: '#formTextEmail', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            
            const isValid = validatorInputEmail.isValidNotEmpty() && validatorInputEmail.isValidEmail()
            if (!isValid) return

            const inputEmail = document.querySelector('#inputEmail')

            submitButtonHandler(
                event.target,
                async (resolve, reject) => {
                    try {
                        const response = await ConnectionAPI.LoginUser(inputEmail.value)
    
                        if (response) resolve()
                        else reject()
                    } catch (exception) {
                        reject()
                    }
                },
                () => navigateTo(`/login/code?email=${ inputEmail.value }`)
            )
        }

        addAllListeners() {
            const buttonLogin = document.querySelector('#buttonLogin')
            buttonLogin.addEventListener('click', this.onLoginHandler)
        }

        #createPage() {
            return (/*html*/`
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
                                class="${ classesForms['button'] } ${ classesForms['button__secondary'] } ${ classesForms['button__submit'] }">Sign In</button>
                        </div>
                    </div>

                    <p class="caption">Don't have account? <a class="land__link caption" href="/register" data-link>Sign Up<a/></p>
                </div>
            `)
        }

        render() {
            this.appendDOM(this.#createPage())

            enableBackMenu()
            this.addAllListeners()
        }
    })