const tags = (() => {
    const allowedTags = [
        { id: 'path', icon: 'PathIcon', label: 'Caminho', description: 'Construir conjunto de percursos intricados.' },
        { id: 'wall', icon: 'WallIcon', label: 'Muro', description: 'Obstaculos difucultando o percuso do personagem.' },
        { id: 'mouse', icon: 'MouseIcon', label: 'Rato', description: 'Personagem que busca a saída incerta do labirinto (entrada).' },
        { id: 'cheese', icon: 'CheeseIcon', label: 'Queijo', description: 'Objetivo final do rato (saída).' }
    ]

    const notAllowedTags = []

    return {
        allowedTags: () => {
            return allowedTags
        },
        notAllowedTags: () => {
            return notAllowedTags
        }
    }
})()

export default tags