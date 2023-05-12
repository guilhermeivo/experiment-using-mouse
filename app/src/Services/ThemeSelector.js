export default class ThemeSelector {
    constructor(themes, transition) {
        this.themes = themes
        this.transition = transition

        if (!localStorage.getItem('theme')) this.setTheme(themes[0].value)
        else this.setTheme(localStorage.getItem('theme'))
    }

    setTheme(name) {
        this.themes.map(theme => {
            if (theme.value === name) {
                document.body.setAttribute('data-theme', name)
                    localStorage.setItem('theme', name)
            }
        })
    }

    changeTheme(name) {
        this.themes.map(theme => {
            if (theme.value === name) {
                this.transition.opacity().then(() => {
                    document.body.setAttribute('data-theme', name)
                    localStorage.setItem('theme', name)
                })
            }
        })
    }
}