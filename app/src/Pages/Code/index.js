import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { checkToken, navigateTo, priorityInput, submitButtonHandler } from "../../Common/common"

export default customElements.define('code-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onCodeHandler = this.onCodeHandler.bind(this)

            const urlParams = new URLSearchParams(window.location.search)
            const emailParam = urlParams.get('email')

            if (!emailParam) window.location.href = `/`
            if (checkToken()) window.location.href = `/`

            this.state = {
                email: emailParam || 'email',
                code: ''
            }
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
        }

        onCodeHandler(event) {
            if (this.state.code.length < 6) return

            submitButtonHandler(
                event.target,
                async (resolve, reject) => {
                    try {
                        const response = await ConnectionAPI.CodeUser(this.state.email, this.state.code)
    
                        if (response && response.auth) {
                            localStorage.setItem('auth', JSON.stringify({
                                ...response,
                                createAt: new Date()
                            }))
                            resolve()
                        }
                        else reject()
                    } catch (exception) {
                        reject()
                    }
                },
                () => navigateTo('/')
            )
        }

        addEventsListeners() {
            const inputs = document.querySelectorAll(`.${ classes['pin'] }`)
            inputs.forEach((input, key) => {
                input.addEventListener('input', () => {
                    if (input.value) {
                        if (key === 5) {
                            const userCode = [...inputs].map((input) => input.value).join('')
                            this.state.code = userCode.toLowerCase()
                        } else {
                            inputs[key + 1].focus()
                        }
                    }
                })

                input.addEventListener('focus', () => {
                    if (input.value) input.select()
                })
                
                input.addEventListener('keydown', priorityInput)
            })

            const buttonCode = document.querySelector('#buttonCode')
            buttonCode.addEventListener('click', this.onCodeHandler)
        }

        removeEventsListeners() {
            const buttonCode = document.querySelector('#buttonCode')
            buttonCode.removeEventListener('click', this.onCodeHandler)
        }

        render() {
            this.innerHTML = `
            <div class="${ classes['wrapper'] }">
                <h1>Verify your access</h1>
                <p>Please enter the code sent to ${ this.state.email }.</p>

                <div class="${ classesForms['form-controls'] }">
                    <div class="${ classesForms['form__text-control'] } ${ classesForms['form__pin-control'] }">
                        <input class="${ classes['pin'] }" type="text" maxlength="1" />
                        <input class="${ classes['pin'] }" type="text" maxlength="1" />
                        <input class="${ classes['pin'] }" type="text" maxlength="1" />
                        <input class="${ classes['pin'] }" type="text" maxlength="1" />
                        <input class="${ classes['pin'] }" type="text" maxlength="1" />
                        <input class="${ classes['pin'] }" type="text" maxlength="1" />
                    </div>
                    
                    <div class="${ classesForms['form__text-control'] }">
                        <button 
                            id="buttonCode" 
                            class="${ classesForms['button'] } ${ classesForms['button__secondary'] } ${ classesForms['button__submit'] }">Confirm</button>
                    </div>
                    <div class="${ classesForms['form__text-control'] }">
                        <button 
                            id="buttonBack" 
                            class="${ classesForms['button'] } ${ classesForms['button__primary'] }"
                            onclick="history.back()">Back To Login</button>    
                    </div>
                </div>
            </div>
            `

            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')

            this.addEventsListeners()
        }
    })