import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { disableBackMenu, enableBackMenu, navigateTo, submitButtonHandler } from "../../Common/common"

export const PAGE_TAG = 'code-page'

export default customElements.define(PAGE_TAG, 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onInputHandler = this.onInputHandler.bind(this)
            this.onCodeHandler = this.onCodeHandler.bind(this)

            if (!window.getParameterUrl('email')) history.back()

            this.state = {
                email: window.getParameterUrl('email'),
                codeSize: this.getAttribute('code-size') || 6,
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
            disableBackMenu()
        }

        onCodeHandler(event) {
            if (this.state.code.length < this.state.codeSize) return

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

        onInputHandler(event) {
            const input = event.target
            const inputs = input.parentElement.children
            const key = parseInt(input.getAttribute('key'))

            if (input.value) {
                if (key === inputs.length - 1) {
                    const userCode = [...inputs].map((input) => input.value).join('')
                    this.state.code = userCode.toLowerCase().trim()
                    
                } else {
                    inputs[key + 1].focus()
                }
            }
        }

        addAllListeners() {
            const inputs = document.querySelectorAll(`.${ classes['pin'] }`)
            inputs.forEach((input) => {
                input.addEventListener('input', this.onInputHandler)
            })

            const buttonSubmit = document.querySelector('#buttonSubmit')
            buttonSubmit.addEventListener('click', this.onCodeHandler)
        }

        #createPage() {
            return (/*html*/`
            <div class="${ classes['wrapper'] }">
                <h1>Verify your access</h1>
                <p>Please enter the code sent to ${ this.state.email }.</p>

                <div class="${ classesForms['form-controls'] }">
                    <div class="${ classesForms['form__text-control'] } ${ classesForms['form__pin-control'] }">
                        ${(() => {
                            let returns = ''
                            for (let i = 0; i < this.state.codeSize; i++) {
                                returns += `<input class="${ classes['pin'] }" type="text" maxlength="1" key="${ i }" />`
                            }
                            return returns
                        })()}
                    </div>
                    
                    <div class="${ classesForms['form__text-control'] }">
                        <button 
                            id="buttonSubmit" 
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
            `)
        }

        render() {
            this.appendDOM(this.#createPage())

            enableBackMenu()
            this.addAllListeners()
        }
    })