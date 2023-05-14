export default class ThemeSelector {
    constructor(themes, transition) {
        if (themes.length < 1) throw new Error('Must have at least one theme.')

        this.themes = themes
        this.transition = transition

        if (!localStorage.getItem('theme')) this.setTheme(themes[0].value)
        else this.setTheme(localStorage.getItem('theme'))
    }

    setTheme(name) {
        const found = this.themes.find(theme => theme.value === name)

        if (!found) throw new Error('No theme with that name could be found.')

        document.body.setAttribute('data-theme', found.value)
        localStorage.setItem('theme', found.value)
    }

    changeTheme(name) {        
        this.transition.opacity().then(() => {
            this.setTheme(name)
        })
    }
}