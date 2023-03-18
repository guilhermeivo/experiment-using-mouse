import Sprite from '../scripts/Sprite'
import { getDirectoryAssetsPath } from './utils'

const tags = (() => {
    const allowedTags = [
        { 
            id: 'path', 
            icon: 'PathIcon', 
            label: 'Caminho', 
            description: 'Construir conjunto de percursos intricados.', 
            unique: false,
            sprite: new Sprite({
                src: getDirectoryAssetsPath('FileMap', 'image'),
                sprites: {
                    'grass-variants': [ [ 0, 2 ], [ 1, 2 ], [ 2, 2 ], [ 3, 2 ], [ 4, 2 ], [ 5, 2 ], [ 6, 2 ], [ 7, 2 ] ]
                }
            }),
        }, { 
            id: 'wall', 
            icon: 'WallIcon', 
            label: 'Muro', 
            description: 'Obstaculos difucultando o percuso do personagem.', 
            unique: false,
            sprite: new Sprite({
                src: getDirectoryAssetsPath('FileMap', 'image'),
                sprites: {
                    'wall-edge': [ 0, 0 ],
                    'wall-edge-left': [ 1, 0 ],
                    'wall-edge-right': [ 2, 0 ],
                    'wall-edge-top': [ 3, 0 ],
                    'wall-edge-left-right': [ 4, 0 ],
                    'wall-edge-left-top': [ 5, 0 ],
                    'wall-edge-right-top': [ 6, 0 ],
                    'wall-edge-full': [ 7, 0 ],

                    'wall-bottom-edge': [ 0, 1 ],
                    'wall-bottom-edge-left': [ 1, 1 ],
                    'wall-bottom-edge-right': [ 2, 1 ],
                    'wall-bottom-edge-top': [ 3, 1 ],
                    'wall-bottom-edge-left-right': [ 4, 1 ],
                    'wall-bottom-edge-left-top': [ 5, 1 ],
                    'wall-bottom-edge-right-top': [ 6, 1 ],
                    'wall-bottom-edge-full': [ 7, 1 ],
                }
            }),
        }, { 
            id: 'mouse', 
            icon: 'MouseIcon', 
            label: 'Rato', 
            description: 'Personagem que busca a saída incerta do labirinto (entrada).', 
            unique: true 
        }, { 
            id: 'cheese', 
            icon: 'CheeseIcon', 
            label: 'Queijo', 
            description: 'Objetivo final do rato (saída).', 
            unique: true 
        }
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