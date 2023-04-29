import app from '@Api/Common/Server'
import MazeController from '@Api/Controllers/MazeController'
import AccountController from '@Api/Controllers/AccountController'

const routes = app.router()
const mazeController = new MazeController()
const accountController = new AccountController()

routes.get('/api', () => { return { message: 'Route found' } })

routes.post('/account/register', (query, request, response, body) => accountController.Register(request, response))
routes.put('/account/remove', (query, request, response, body) => accountController.Remove(request, response))

routes.get('/api/maze', (query, request, response, body) => mazeController.GetAll(query))
routes.get('/api/maze/{id}', (query, request, response, body) => mazeController.GetById(query))
routes.post('/api/maze', (query, request, response, body) => mazeController.Create(query, body))
routes.post('/api/maze/{id}', (query, request, response, body) => mazeController.Update(query, body))
routes.put('/api/maze/addLikes/{id}', (query, request, response, body) => mazeController.AddLikes(query))
routes.put('/api/maze/addViews/{id}', (query, request, response, body) => mazeController.AddViews(query))

export default routes