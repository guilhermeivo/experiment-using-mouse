"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("@Api/Common/Server"));
const MazeController_1 = __importDefault(require("@Api/Controllers/MazeController"));
const AccountController_1 = __importDefault(require("@Api/Controllers/AccountController"));
const routes = Server_1.default.router();
const mazeController = new MazeController_1.default();
const accountController = new AccountController_1.default();
routes.get('/api', () => { return { message: 'Route found' }; });
routes.post('/account/register', (query, request, response) => accountController.Register(request, response));
routes.get('/api/maze', (request) => mazeController.GetAll(request));
routes.get('/api/maze/{id}', (request) => mazeController.GetById(request));
routes.post('/api/maze', (request) => mazeController.Create(request));
routes.put('/api/maze/addLikes/{id}', (request) => mazeController.AddLikes(request));
routes.put('/api/maze/addViews/{id}', (request) => mazeController.AddViews(request));
exports.default = routes;
//# sourceMappingURL=routes.js.map