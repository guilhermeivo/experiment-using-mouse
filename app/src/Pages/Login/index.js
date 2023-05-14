import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import validators from '../../Common/validators'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { checkToken, createElementFromHTML, navigateTo, priorityInput, submitButtonHandler } from "../../Common/common"

export default customElements.define('login-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            if (checkToken()) window.location.href = `/`

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

            this.removeEventsListener()
        }

        onLoginHandler(event) {
            const validatorInputEmail = validators(
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

        addEventsListener() {
            const inputEmail = document.querySelector('#inputEmail')
            inputEmail.addEventListener('keydown', priorityInput)

            const buttonLogin = document.querySelector('#buttonLogin')
            buttonLogin.addEventListener('click', this.onLoginHandler)
        }

        removeEventsListener() {
            const inputEmail = document.querySelector('#inputEmail')
            inputEmail.removeEventListener('keydown', priorityInput)

            const buttonLogin = document.querySelector('#buttonLogin')
            buttonLogin.removeEventListener('click', this.onLoginHandler)
        }

        render() {
            this.append(createElementFromHTML(`
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
            `))

            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')

            this.addEventsListener()
        }
    })