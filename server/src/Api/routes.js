import app from '@Api/Common/Server'
import MazeController from '@Api/Controllers/MazeController'
import AccountController from '@Api/Controllers/AccountController'

const routes = app.router()
const mazeController = new MazeController()
const accountController = new AccountController()

routes.get('/api', () => { return { message: 'Route found' } })

routes.post('/account/register', (query, request, response) => accountController.Register(request, response))

routes.get('/api/maze', (request) => mazeController.GetAll(request))
routes.get('/api/maze/{id}', (request) => mazeController.GetById(request))
routes.post('/api/maze', (request) => mazeController.Create(request))
routes.put('/api/maze/addLikes/{id}', (request) => mazeController.AddLikes(request))
routes.put('/api/maze/addViews/{id}', (request) => mazeController.AddViews(request))

export default routes