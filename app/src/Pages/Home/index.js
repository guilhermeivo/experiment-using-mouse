import classes from './style.module.scss'

export default customElements.define('home-page', 
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

        disconnectedCallback() { }

        render() {
            this.innerHTML = `
            <div class="${ classes['wrapper'] }">
                <h1>Experiment Using Mouse 🖱️</h1>
                <div class="${ classes['flex'] }">
                    <div class="input-control">
                        <a href="/make" data-link>Make</a>
                    </div>
                    <div class="input-control">
                        <a href="/play" data-link>Play</a>
                    </div>
                </div>
            </div>
            `
        }
    })