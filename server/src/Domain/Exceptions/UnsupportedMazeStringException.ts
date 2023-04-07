const UnsupportedMazeStringException = (message: string) => ({
    error: new Error(message),
    code: 'UNSUPPOTERD_MAZE_STRING_EXCEPTION'
})
UnsupportedMazeStringException.prototype = Error.prototype

export default UnsupportedMazeStringException