export default class Router {
    constructor(routes) {
        this.routes = routes
        this.rootElement = document.querySelector('#app')
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
            this.lastRoute.transition().then(() => {
                document.title = route.name
                this.rootElement.innerHTML = `<${ route.nameTag }/>`
                this.lastRoute = route
            })
        } else {
            document.title = route.name
            this.rootElement.innerHTML = `<${ route.nameTag }/>`
            this.lastRoute = route
        }
    }
}