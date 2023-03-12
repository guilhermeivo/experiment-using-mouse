const tags = (() => {
    const allowedTags = [
        { id: 'path', icon: 'PathIcon', label: 'Caminho', description: 'Construir conjunto de percursos intricados.', unique: false },
        { id: 'wall', icon: 'WallIcon', label: 'Muro', description: 'Obstaculos difucultando o percuso do personagem.', unique: false },
        { id: 'mouse', icon: 'MouseIcon', label: 'Rato', description: 'Personagem que busca a saída incerta do labirinto (entrada).', unique: true },
        { id: 'cheese', icon: 'CheeseIcon', label: 'Queijo', description: 'Objetivo final do rato (saída).', unique: true }
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