import MyComponent from '../components/MyComponent'

(() => {
    `strict`

    const myComponent = new MyComponent()
    const myMain = document.querySelector('.main')

    myMain.innerHTML = myComponent.render()

    console.log('⭐')
})()