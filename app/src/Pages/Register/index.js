import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import validators from '../../Common/validators'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { checkToken, createElementFromHTML, navigateTo, priorityInput, submitButtonHandler } from "../../Common/common"

export default customElements.define('register-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            if (checkToken()) window.location.href = `/`

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
            const validatorInputEmail = validators(
                '#inputEmail', { formElement: '#formTextEmail', errorElement: `.${ classesForms['form__error-message'] }`, errorClass: classesForms['form__text-control--error']})
            const validatorInputName = validators(
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

        addEventsListener() {
            const buttonRegister = document.querySelector('#buttonRegister')
            buttonRegister.addEventListener('click', this.onRegisterHandler)

            const inputUsername = document.querySelector('#inputUsername')
            inputUsername.addEventListener('keydown', priorityInput)

            const inputEmail = document.querySelector('#inputEmail')
            inputEmail.addEventListener('keydown', priorityInput)
        }

        removeEventsListener() {
            const buttonRegister = document.querySelector('#buttonRegister')
            buttonRegister.removeEventListener('click', this.onRegisterHandler)

            const inputUsername = document.querySelector('#inputUsername')
            inputUsername.removeEventListener('keydown', priorityInput)

            const inputEmail = document.querySelector('#inputEmail')
            inputEmail.removeEventListener('keydown', priorityInput)
        }

        #createPage() {
            return (`
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
            this.append(createElementFromHTML(this.#createPage()))

            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')
            
            this.addEventsListener()
        }
    })