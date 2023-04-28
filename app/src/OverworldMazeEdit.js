import MazeObject from "./MazeObject"
import Sprite from "./Sprite"
import { uid } from "./Common/common"

import PathIcon from "./assets/images/PathIcon.png"
import WallIcon from "./assets/images/WallIcon.png"
import MouseIcon from "./assets/images/MouseIcon.png"
import CheeseIcon from "./assets/images/CheeseIcon.png"
import EraserIcon from "./assets/images/EraserIcon.png"

import FileMapImage from './assets/images/FileMap.png'

const SMALLEST_POSSIBLE_SIZE = 4
const LARGEST_POSSIBLE_SIZE = 20

export default class OverworldMazeEdit {
    #rows
    #columns

    constructor(config) {
        this.id = uid() || null
        this.lowerSrc = config.lowerSrc || null
        this.upperSrc = config.upperSrc || null

        this.rows = config.rows || SMALLEST_POSSIBLE_SIZE
        this.columns = config.columns || SMALLEST_POSSIBLE_SIZE

        this.mazeObjects = config.mazeObjects || {
            cheese: new MazeObject({
                id: window.editors.cheese.id,
                x: -1,
                y: -1
            }),
            mouse: new MazeObject({
                id: window.editors.mouse.id,
                x: -1,
                y: -1
            })
        }
        this.tilesMaze = config.tilesMaze || { }
        if (Object.keys(this.tilesMaze).length === 0) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    this.add({ x: i + 1, y: j + 1 })
                }
            }
        }
    }

    get rows() {
        return this.#rows
    }

    set rows(value) {
        if (value >= SMALLEST_POSSIBLE_SIZE && value <= LARGEST_POSSIBLE_SIZE) {
            this.#rows = value
        }
    }

    get columns() {
        return this.#columns
    }

    set columns(value) {
        if (value >= SMALLEST_POSSIBLE_SIZE && value <= LARGEST_POSSIBLE_SIZE) {
            this.#columns = value
        }
    }

    add({ x, y }) {
        this.addTile({ x, y, typeName: window.editors.path.id })
    }

    addTile({ x, y, typeName }) {
        this.tilesMaze[`${x},${y}`] = typeName
    }

    getTile({ x, y }) {
        return this.tilesMaze[`${x},${y}`]
    }

    setGameObject({ name, x, y }) {
        this.mazeObjects[name].x = x
        this.mazeObjects[name].y = y
    }

    remove({ x, y }) {
        delete this.tilesMaze[`${x},${y}`]
    }
}

const enumTypeEditors = {
    Tile: 'Tile', Object: 'Object'
}

window.editors = {
    wall: {
        id: 'wall',
        icon: WallIcon,
        label: 'Wall',
        description: 'Obstacles hindering the characters path.',
        type: enumTypeEditors.Tile,
        sprite: new Sprite({
            src: FileMapImage,
            variants: {
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
    },
    path: {
        id: 'path',
        icon: PathIcon,
        label: 'Path',
        description: 'Build set of intricate pathways.',
        type: enumTypeEditors.Tile,
        sprite: new Sprite({
            src: FileMapImage,
            variants: {
                'grass-variants': [ [ 0, 2 ], [ 1, 2 ], [ 2, 2 ], [ 3, 2 ], [ 4, 2 ], [ 5, 2 ], [ 6, 2 ], [ 7, 2 ] ]
            }
        })
    },
    cheese: {
        id: 'cheese',
        icon: CheeseIcon,
        label: 'Cheese', 
        description: 'Mouses final goal (exit).', 
        type: enumTypeEditors.Object
    },
    mouse: {
        id: 'mouse',
        icon: MouseIcon,
        label: 'Mouse', 
        description: 'Character who seeks the uncertain exit from the labyrinth (entrance).',
        type: enumTypeEditors.Object
    },
    air: {
        id: 'air',
        icon: EraserIcon,
        label: 'Erase',
        description: 'air',
        type: enumTypeEditors.Tile,
        sprite: new Sprite({
            src: FileMapImage,
            variants: {
                'eraser-variants': [ [ 0, 5 ] ]
            }
        })
    },
}