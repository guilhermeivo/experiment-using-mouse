import createUserTable from './migrates/01_create_user'
import createTokenTable from './migrates/02_create_token'
import createMazeTable from './migrates/03_create_maze'
import createInteractionTable from './migrates/04_create_interaction'

export default () => {
    createUserTable()
    createTokenTable()
    createMazeTable()
    createInteractionTable()
}