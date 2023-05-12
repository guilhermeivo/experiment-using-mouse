import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'
import ConnectionAPI from '../../Services/ConnectionAPI'
import { checkToken } from "../../Common/common"

const TIME_SHOWING_MESSAGE = 1000
const MINIMUM_TIME_WAIT = 1000

export default customElements.define('code-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            this.onCodeHandler = this.onCodeHandler.bind(this)

            const urlParams = new URLSearchParams(window.location.search)
            const emailParam = urlParams.get('email')

            if (!emailParam) window.location.href = `/`
            if (checkToken(JSON.parse(sessionStorage.getItem('auth')))) window.location.href = `/`

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
            const targetClass = event.target.classList
            if (targetClass.contains(classesForms['button__submit--active']) || targetClass.contains(classesForms['button__submit--done']) || targetClass.contains(classesForms['button__submit--error'])) return

            if (this.state.code.length < 6) return

            targetClass.add(classesForms['button__submit--active'])
            Promise.all([new Promise(async (resolve, reject) => {
                try {
                    const response = await ConnectionAPI.CodeUser(this.state.email, this.state.code)

                    if (response && response.auth) {
                        sessionStorage.setItem('auth', JSON.stringify({
                            ...response,
                            createAt: new Date()
                        }))
                        window.location.href = `/`
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

        addEventsListeners() {
            const inputs = document.querySelectorAll(`.${ classes['pin'] }`)
            inputs.forEach((input, key) => {
                if (key !== 0) {
                    input.addEventListener('click', () => {
                        inputs[0].focus()
                    })
                }

                input.addEventListener('keyup', () => {
                    if (input.value) {
                        if (key === 5) {
                            const userCode = [...inputs].map((input) => input.value).join('')
                            this.state.code = userCode
                        } else {
                            inputs[key + 1].focus()
                        }
                    }
                })

                input.addEventListener('focus', event => {
                    if (input.value) input.value = ''
                })
                
                input.addEventListener('keydown', event => {
                    event.stopPropagation()
                })
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