export default class Router {
    constructor(routes, rootElement) {
        this.routes = routes
        this.rootElement = rootElement || document.querySelector('#app')
        this.lastRoute = ''
    }

    initialize() {
        window.addEventListener('click', event => {
            if (event.target.matches('[data-link]')) {
                event.preventDefault()
                history.pushState({ }, '', event.target.href)
                this.handleChangeRoute()
            }
        })

        window.addEventListener('popstate', () => { this.handleChangeRoute() })
        window.addEventListener('DOMContentLoaded', () => { this.handleChangeRoute() })
    }

    handleChangeRoute() {
        const route = this.routes[location.pathname]

        if (route) {
            this.navigateToRoute(route)
        } else {
            history.replaceState({ }, '', '/404')
            this.handleChangeRoute()
        }
    }

    navigateToRoute(route) {
        if (this.lastRoute.transition) {
            this.lastRoute.transition(new Promise(resolve => {
                setTimeout(() => {
                    const nextPage = document.createElement(route.nameTag)
                    if (this.rootElement.firstElementChild) 
                        this.rootElement.firstElementChild.remove()
                    this.rootElement.append(nextPage)
                    document.title = route.name
                    this.lastRoute = route
                    
                    resolve()
                }, 200)
            }))
        } else {
            const nextPage = document.createElement(route.nameTag)
            if (this.rootElement.firstElementChild) 
                this.rootElement.firstElementChild.remove()
            this.rootElement.append(nextPage)
            document.title = route.name
            this.lastRoute = route
        }
    }
}