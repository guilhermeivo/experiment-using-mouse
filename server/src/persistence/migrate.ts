import createUser from './migrations/01_create_user'
import createToken from './migrations/02_create_token'
import createFile from './migrations/03_create_file'
import createMaze from './migrations/04_create_maze'
import createInteraction from './migrations/05_create_interaction'

export default () => {
    createUser()
    createToken()
    createFile()
    createMaze()
    createInteraction()
}