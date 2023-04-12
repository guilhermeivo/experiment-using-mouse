import Sprite from './Sprite'
import FileMapImage from '../assets/images/FileMap.png'

const tags = (() => {
    const allowedTags = [
        { 
            id: 'path', 
            icon: 'PathIcon', 
            label: 'Path', 
            description: 'Build set of intricate pathways.', 
            unique: false,
            sprite: new Sprite({
                src: FileMapImage,
                sprites: {
                    'grass-variants': [ [ 0, 2 ], [ 1, 2 ], [ 2, 2 ], [ 3, 2 ], [ 4, 2 ], [ 5, 2 ], [ 6, 2 ], [ 7, 2 ] ]
                }
            }),
        }, { 
            id: 'wall', 
            icon: 'WallIcon', 
            label: 'Wall', 
            description: 'Obstacles hindering the characters path.', 
            unique: false,
            sprite: new Sprite({
                src: FileMapImage,
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
            getSpriteName: (tagsAround) => {
                // tagsAround[0] - left
                // tagsAround[1] - top
                // tagsAround[2] - bottom
                // tagsAround[3] - right
                if (tagsAround[0] !== 'wall' && tagsAround[1] !== 'wall' && tagsAround[2] === 'wall' && tagsAround[3] !== 'wall') {
                    return 'wall-edge'
                } else if (tagsAround[0] === 'wall' && tagsAround[1] !== 'wall' && tagsAround[2] === 'wall' && tagsAround[3] !== 'wall') {
                    return 'wall-edge-left'
                } else if (tagsAround[0] !== 'wall' && tagsAround[1] !== 'wall' && tagsAround[2] === 'wall' && tagsAround[3] === 'wall') {
                    return 'wall-edge-right'
                } else if (tagsAround[0] !== 'wall' && tagsAround[1] === 'wall' && tagsAround[2] === 'wall' && tagsAround[3] !== 'wall') {
                    return 'wall-edge-top'
                } else if (tagsAround[0] === 'wall' && tagsAround[1] !== 'wall' && tagsAround[2] === 'wall' && tagsAround[3] === 'wall') {
                    return 'wall-edge-left-right'
                } else if (tagsAround[0] === 'wall' && tagsAround[1] === 'wall' && tagsAround[2] === 'wall' && tagsAround[3] !== 'wall') {
                    return 'wall-edge-left-top'
                } else if (tagsAround[0] !== 'wall' && tagsAround[1] === 'wall' && tagsAround[2] === 'wall' && tagsAround[3] === 'wall') {
                    return 'wall-edge-right-top'
                } else if (tagsAround[0] === 'wall' && tagsAround[1] === 'wall' && tagsAround[2] === 'wall' && tagsAround[3] === 'wall') {
                    return 'wall-edge-full'
                } else if (tagsAround[0] !== 'wall' && tagsAround[1] !== 'wall' && tagsAround[2] !== 'wall' && tagsAround[3] !== 'wall') {
                    return 'wall-bottom-edge'
                } else if (tagsAround[0] === 'wall' && tagsAround[1] !== 'wall' && tagsAround[2] !== 'wall' && tagsAround[3] !== 'wall') {
                    return 'wall-bottom-edge-left'
                } else if (tagsAround[0] !== 'wall' && tagsAround[1] !== 'wall' && tagsAround[2] !== 'wall' && tagsAround[3] === 'wall') {
                    return 'wall-bottom-edge-right'
                } else if (tagsAround[0] !== 'wall' && tagsAround[1] === 'wall' && tagsAround[2] !== 'wall' && tagsAround[3] !== 'wall') {
                    return 'wall-bottom-edge-top'
                } else if (tagsAround[0] === 'wall' && tagsAround[1] !== 'wall' && tagsAround[2] !== 'wall' && tagsAround[3] === 'wall') {
                    return 'wall-bottom-edge-left-right'
                } else if (tagsAround[0] === 'wall' && tagsAround[1] === 'wall' && tagsAround[2] !== 'wall' && tagsAround[3] !== 'wall') {
                    return 'wall-bottom-edge-left-top'
                } else if (tagsAround[0] !== 'wall' && tagsAround[1] === 'wall' && tagsAround[2] !== 'wall' && tagsAround[3] === 'wall') {
                    return 'wall-bottom-edge-right-top'
                } else if (tagsAround[0] === 'wall' && tagsAround[1] === 'wall' && tagsAround[2] !== 'wall' && tagsAround[3] === 'wall') {
                    return 'wall-bottom-edge-full'
                }
            }
        }, { 
            id: 'mouse', 
            icon: 'MouseIcon', 
            label: 'Mouse', 
            description: 'Character who seeks the uncertain exit from the labyrinth (entrance).', 
            unique: true,
            sprite: new Sprite({
                src: FileMapImage,
                sprites: {
                    'mouse-variants': [ [ 0, 3 ] ]
                }
            }),
        }, { 
            id: 'cheese', 
            icon: 'CheeseIcon', 
            label: 'Cheese', 
            description: 'Mouses final goal (exit).', 
            unique: true ,
            sprite: new Sprite({
                src: FileMapImage,
                sprites: {
                    'cheese-variants': [ [ 0, 4 ] ]
                }
            }),
        }
    ]

    const notAllowedTags = []

    return {
        allowedTags: () => {
            return allowedTags
        }
    }
})()

export default tags