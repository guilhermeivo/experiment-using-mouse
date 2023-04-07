import { createElementFromHTML, getDirectoryAssetsPath } from '../../utils/utils'

import styles from './style.module.scss'
const { locals: style } = styles

export default customElements.define('header-navigation', 
    class extends HTMLElement {
        constructor(...props) {
            super(props)

            styles.use()
            
            this.addCustomToolbarMenu = this.addCustomToolbarMenu.bind(this)
        }

        async connectedCallback() {
            if (!this.rendered) {
                await this.render()
                this.rendered = true
            }
        }

        addCustomToolbarMenu(element) {
            const customToolbarMenu = this.querySelector('#customToolbarMenu')
            customToolbarMenu.appendChild(element)
        }

        removeCustomToolbarMenu() {
            const customToolbarMenu = this.querySelector('#customToolbarMenu')
            customToolbarMenu.firstChild.remove()
        }

        addCustomMenu(element) {
            const customMenu = this.querySelector('#customMenu')
            customMenu.appendChild(element)
        }

        removeCustomMenu() {
            const customMenu = this.querySelector('#customMenu')
            customMenu.firstChild.remove()
        }

        #createHeaderNavigation() {
            return (`
                <nav class="header-navigation">
                    <img class="logo" src="${ getDirectoryAssetsPath('Logo', 'vector') }" alt="logo">
                    <div id="customToolbarMenu" class="custom-toolbar-menu"></div>
                    <div id="customMenu" class="custom-menu"></div>
                </nav>
            `)
        }

        async render() {
            this.append(createElementFromHTML(this.#createHeaderNavigation()))
        }
    })