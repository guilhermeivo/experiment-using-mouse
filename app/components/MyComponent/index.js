import styles from './style.module.scss'
const { locals: style } = styles

export default class MyComponent {
    constructor() {
        styles.use()
    }

    render() {
        console.log()
        return `
            <div class="${style.block}">Block</div>
        `
    }
}