import createUserTable from './migrates/01_create_user'
import createTokenTable from './migrates/02_create_token'
import createFileTable from './migrates/03_create_file'
import createMazeTable from './migrates/04_create_maze'
import createInteractionTable from './migrates/05_create_interaction'

export default () => {
    createUserTable()
    createTokenTable()
    createFileTable()
    createMazeTable()
    createInteractionTable()
}