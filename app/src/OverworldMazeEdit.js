import MazeObject from "./MazeObject";
import { uid } from "./Common/common";

import PathIcon from "./assets/images/PathIcon.png"
import WallIcon from "./assets/images/WallIcon.png"
import MouseIcon from "./assets/images/MouseIcon.png"
import CheeseIcon from "./assets/images/CheeseIcon.png"

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
                x: [-1, -1],
                y: [-1, -1]
            }),
            mouse: new MazeObject({
                x: [-1, -1],
                y: [-1, -1]
            })
        }
        this.tilesMaze = config.tiles || { }
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
        this.addTile({ x, y, typeName: 'air' })
    }

    addTile({ x, y, typeName }) {
        this.tilesMaze[`${x},${y}`] = typeName
    }

    setGameObject({ name, x, y }) {
        this.mazeObjects[name].x = x
        this.mazeObjects[name].x = y
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
        icon: WallIcon,
        label: 'Wall',
        description: 'Obstacles hindering the characters path.',
        type: enumTypeEditors.Tile
    },
    path: {
        icon: PathIcon,
        label: 'Path',
        description: 'Build set of intricate pathways.',
        type: enumTypeEditors.Tile
    },
    air: {
        icon: '',
        label: 'Erase',
        description: '',
        type: enumTypeEditors.Tile
    },
    cheese: {
        icon: CheeseIcon,
        label: 'Cheese', 
        description: 'Mouses final goal (exit).', 
        type: enumTypeEditors.Object
    },
    mouse: {
        icon: MouseIcon,
        label: 'Mouse', 
        description: 'Character who seeks the uncertain exit from the labyrinth (entrance).',
        type: enumTypeEditors.Object
    }
}