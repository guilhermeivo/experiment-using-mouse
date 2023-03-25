import app from '@Infrastructure/Common/Server'
import MazeController from '@Api/Controllers/MazeController'

const routes = app.router()
const mazeController = new MazeController()

routes.get('/api', (request, response) => { return { message: 'Route found' } })

routes.get('/api/maze', (request, response) => mazeController.GetAll(request))
routes.get('/api/maze/{id}', (request, response) => mazeController.GetById(request))
routes.post('/api/maze', (request, response) => mazeController.Create(request))
routes.post('/api/maze/addLikes/{id}', (request, response) => mazeController.AddLikes(request))
routes.post('/api/maze/addViews/{id}', (request, response) => mazeController.AddViews(request))

export default routes