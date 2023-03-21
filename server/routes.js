import app from './common/Server'
import MazeController from './controllers/MazeController'

const routes = app.router()
const mazeController = new MazeController()

routes.get('/api', (request, response) => {
    return mazeController.Get({ message: 'Route found' })
})
routes.get('/api/maze', (request, response) => mazeController.Get(request))

export default routes