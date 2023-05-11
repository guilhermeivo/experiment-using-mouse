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

(() => {
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

    window.onload = () => {
        const floatingMenu = document.querySelector('#headerNavigation').querySelector('#floatingMenu').firstElementChild
        const floatingVertical = document.querySelector('floating-vertical')
        floatingMenu.addEventListener('click', () => { floatingVertical.toggle() })
        floatingVertical.addContentElement({ title: 'Authentication', element: createElementFromHTML(`
            <div id="wrapperSession">
                <div class="${ classesForms['form-controls'] }">
                    <div class="${ classesForms['form__text-control'] }">
                        <input 
                            id="inputAuth" 
                            type="text" 
                            name="input-name" 
                            placeholder=" " 
                            value="${ checkToken(JSON.parse(sessionStorage.getItem('auth'))) }" 
                            disabled />
                        <label for="inputAuth">Auth</label>
                        <span class="${ classesForms['form__error-message'] }"></span>
                    </div>
                </div>
            </div>
        `)})
    }
    
})()