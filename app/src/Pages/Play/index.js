import classes from './style.module.scss'
import { checkToken, createElementFromHTML, navigateTo } from "../../Common/common"
import ConnectionAPI from '../../Services/ConnectionAPI'

export default customElements.define('play-page', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            
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

        async render() {
            if (!checkToken(JSON.parse(sessionStorage.getItem('auth')))) {
                navigateTo('/login')
                const message = document.querySelector('message-info')
                message.addMessageInfo({ description: `To proceed you need to login or register.`, type: 'warn' })
            } else {
                const responseGetMazes = await ConnectionAPI.GetMazes()
                const responseGetMazeByUser = await ConnectionAPI.GetMazeByUser()

                this.append(createElementFromHTML(`
                <div class="${ classes['wrapper'] }">
                    ${ (() => {
                        if (responseGetMazeByUser.length > 0) {
                            return (`
                                <h1>My mazes</h1>
                                <div class="${ classes['list--horizontal'] }">
                                ${ (() => {
                                    if (responseGetMazeByUser.length > 0) {
                                        return responseGetMazeByUser.map(element => {
                                            return (`
                                                <card-info
                                                    data-id="${ element.id }"
                                                    data-title="${ element.name }"
                                                    data-likes="${ element.like || 0 }"
                                                    data-views="${ element.views || 0 }"
                                                    ${ element.isLiked ? 'data-liked' : '' }
                                                    data-image="${ element.image }"
                                                ></card-info>
                                            `)
                                        }).join('')
                                    }                                     
                                })()}
                                </div>
                            `)
                        }
                    })() }
    
                    <h1>Public mazes</h1>
    
                    <div class="${ classes['list--vertical'] }">
                    ${ (() => {
                        if (responseGetMazes.length > 0) {
                            return responseGetMazes.map(element => {
                                return (`
                                    <card-info
                                        data-id="${ element.id }"
                                        data-title="${ element.name }"
                                        data-likes="${ element.like || 0 }"
                                        data-views="${ element.views || 0 }"
                                        ${ element.isLiked ? 'data-liked' : '' }
                                        data-image="${ element.image }"
                                    ></card-info>
                                `)
                            }).join('')
                        } else {
                            return (`
                                <p>There is no maze at the moment.</p>
                            `)
                        }
                        
                    })()}
                    </div>
                </div>
                `))
            }

            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')
        }
    })