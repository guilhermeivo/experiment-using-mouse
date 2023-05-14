import "./Pages/Home"
import "./Pages/Make"
import "./Pages/Play"
import "./Pages/Register"
import "./Pages/Error"
import "./Pages/Login"
import "./Pages/Code"
import "./Pages/VerifyEmail"

import "./Components/BlocksToolbar"
import "./Components/FloatingVertical"
import "./Components/CardInfo"
import "./Components/MessageInfo"
import "./Components/MazeEdit"
import "./Components/MazeBlock"
import "./Components/PopUp"

import classesForms from "./assets/styles/forms_controls.module.scss"

import Router from "./Services/Router"
import { checkToken, createElementFromHTML } from "./Common/common"
import TransitionPages from "./Common/TransitionPages"
import ThemeSelector from "./Services/ThemeSelector"

(async () => {
    `strict`

    const transition = new TransitionPages('#transitionAnimation')

    // set system routes in application
    new Router({
        '/': { name: 'Home', nameTag: 'home-page', defaultRoute: true, transition: transition.wipeLeft },
        '/make': { name: 'Make', nameTag: 'make-page', transition: transition.wipeRight },
        '/play': { name: 'Play', nameTag: 'play-page', transition: transition.wipeRight },
        '/register': { name: 'Register', nameTag: 'register-page' },
        '/register/verify-email': { name: 'Verify Email', nameTag: 'verify-page' },
        '/login': { name: 'Login', nameTag: 'login-page' },
        '/login/code': { name: 'Code', nameTag: 'code-page' },
        '/404': { name: '404', nameTag: 'error-page' }
    }).initialize()  
    
    // set system themes in application
    const themeSelector = new ThemeSelector([
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'dark-dimmed', label: 'Dark Dimmed' },
        { value: 'contrast', label: 'Contrast' },
    ], transition)

    const hasToken = checkToken(JSON.parse(sessionStorage.getItem('auth')))

    const floatingMenu = document.querySelector('#headerNavigation').querySelector('#floatingMenu').firstElementChild
    const floatingVertical = document.querySelector('floating-vertical')
    floatingMenu.addEventListener('click', () => { floatingVertical.toggle() })
    floatingVertical.addContentElement({ title: 'Authentication', element: createElementFromHTML(`
        <div id="wrapperSession">
            <div class="${ classesForms['form-controls'] }">
                <div class="${ classesForms['form__text-control'] }">
                    <input 
                        id="inputAuth" 
                        type="text" name="input-name" placeholder=" " value="${ hasToken }" 
                        disabled />
                    <label for="inputAuth">Auth</label>
                    <span class="${ classesForms['form__error-message'] }"></span>
                </div>
                ${
                    hasToken 
                    ? `
                    <div class="${ classesForms['form__text-control'] }">
                        <button 
                            id="buttonLogout" 
                            class="${ classesForms['button'] } ${ classesForms['button--small'] } ${ classesForms['button__primary'] }">
                            Logout
                        </button>
                    </div>`
                    : ''
                }
            </div>
        </div>
    `)})

    const buttonLogout = document.querySelector('#buttonLogout')
    if (hasToken) {
        buttonLogout.addEventListener('click', () => {
            sessionStorage.removeItem('auth')
            document.location.reload(false)
        })
    }

    floatingVertical.addContentElement({ title: 'Themes', element: createElementFromHTML(`
        <div id="wrapperThemes">
            <div class="${ classesForms['form-controls'] }">
                <div class="${ classesForms['form__text-control'] }">
                    <select name="themes" id="selectThemes">
                        ${ 
                            themeSelector.themes.map(theme => { 
                                const isSelected = localStorage.getItem('theme') === theme.value
                                return(`
                                    <option 
                                        value="${ theme.value }" ${ isSelected ? 'selected' : '' }>
                                        ${ theme.label }
                                    </option>
                                `) 
                            }).join('') 
                        }
                    </select>
                </div>
            </div>
        </div>
    `)})
    
    const selectThemes = document.querySelector('#selectThemes')
    selectThemes.addEventListener('change', () => {
        themeSelector.changeTheme(selectThemes.value)
    })
    
})()