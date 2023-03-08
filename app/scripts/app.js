import PageCreateMaze from "../pages/CreateMaze"

(() => {
    `strict`

    const root = document.querySelector('#root')
    const element = document.createElement('div')
    element.innerHTML = PageCreateMaze().render
    root.append(element)

    console.log('⭐')
})()