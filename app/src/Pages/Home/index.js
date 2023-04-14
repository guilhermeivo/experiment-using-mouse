import classes from './style.module.scss'
import classesForms from '../../assets/styles/forms_controls.module.scss'

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
                <div class="${ classesForms['form-controls'] } ${ classes['flex'] }">
                    <div class="${ classesForms['form__button-control'] }">
                        <a href="/make" class="${ classesForms['button'] } ${ classesForms['button__secondary'] }" data-link>Make</a>
                    </div>
                    <div class="${ classesForms['form__button-control'] }">
                        <a href="/play" class="${ classesForms['button'] } ${ classesForms['button__primary'] }" data-link>Play</a>
                    </div>
                </div>
            </div>
            `
        }
    })