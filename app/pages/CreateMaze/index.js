import MazeConstruction from '../../components/MazeConstruction'
import BlocksToolbar from '../../components/BlocksToolbar'
import MazeBlocks from '../../components/MazeBlocks'

export default () => {
    const setup = {
        defaultRows: 8,
        defaultColumns: 8
    }

    const render = () => {
        return (`
            <blocks-toolbar></blocks-toolbar>
        
            <main>
                <maze-construction rows="${ setup.defaultRows }" columns="${ setup.defaultColumns }"></maze-construction>
            </main>
        
            <audio id="PlungerImmediate">
                <source src="./assets/PlungerImmediate.mp3" type="audio/mpeg">
                Your browser does not support the audio element
            </audio>
            <audio id="SwitchOn">
                <source src="./assets/SwitchOn.mp3" type="audio/mpeg">
                Your browser does not support the audio element
            </audio>
        `)
    }

    return {
        render: render()
    }
}