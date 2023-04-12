import "./Pages/Home"
import "./Pages/Make"
import "./Pages/Play"

import "./Components/BlocksToolbar"
import "./Components/FloatingVertical"
import "./Components/EditableMaze"
import "./Components/MazeBlocks"
import "./Components/CardInfo"

import Router from "./Services/Router"
import ConnectionAPI from "./Services/ConnectionAPI"
import { createElementFromHTML } from "./Common/common"
import TransitionPages from "./Common/TransitionPages"

(() => {
    `strict`

    const transition = new TransitionPages('#transitionAnimation')

    // set system routes in application
    new Router({
        '/': { name: 'Home', nameTag: 'home-page', defaultRoute: true, transition: transition.transitionLeft },
        '/make': { name: 'Make', nameTag: 'make-page', transition: transition.transitionRight },
        '/play': { name: 'Play', nameTag: 'play-page', transition: transition.transitionRight },
        404: { name: '404', nameTag: 'error-page' }
    }).initialize()

    window.onload = () => {
        // set token id in session for authentication
        if(!localStorage.getItem('sessionToken')) {
            ConnectionAPI.Register((data) => {
                localStorage.setItem('sessionToken', data.Data)
            })
        }

        // add sessionToken to floating menu
        const floatingMenu = document.querySelector('#headerNavigation').querySelector('#floatingMenu').firstElementChild
        const floatingVertical = document.querySelector('floating-vertical')
        floatingMenu.addEventListener('click', () => { floatingVertical.toggle() })
        floatingVertical.addContentElement({ title: 'Session', element: createElementFromHTML(`
            <div id="wrapperSession">
                <div class="input-control">
                    <input id="inputToken" type="text" name="input-name" placeholder=" " value="${ localStorage.getItem('sessionToken') }" disabled />
                    <label for="inputToken">Token session</label>
                </div>
            </div>
        `)})
    }
    
})()