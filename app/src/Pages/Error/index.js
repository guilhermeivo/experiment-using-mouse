import './style.module.scss'

export default customElements.define('error-page', 
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

        render() {
            this.innerHTML = `
            <div class="wrapper">
                <h1>Error</h1>
            </div>
            `

            const backMenu = document.querySelector('#headerNavigation').querySelector('#backMenu')
            if (backMenu.classList.contains('back-menu--disabled')) 
                backMenu.classList.remove('back-menu--disabled')
        }
    })