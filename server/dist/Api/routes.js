"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("@Infrastructure/Common/Server"));
const MazeController_1 = __importDefault(require("@Api/Controllers/MazeController"));
const routes = Server_1.default.router();
const mazeController = new MazeController_1.default();
routes.get('/api', (request, response) => { return { message: 'Route found' }; });
routes.get('/api/maze', (request, response) => mazeController.GetAll(request));
routes.get('/api/maze/{id}', (request, response) => mazeController.GetById(request));
routes.post('/api/maze', (request, response) => mazeController.Create(request));
routes.post('/api/maze/addLikes/{id}', (request, response) => mazeController.AddLikes(request));
routes.post('/api/maze/addViews/{id}', (request, response) => mazeController.AddViews(request));
exports.default = routes;
//# sourceMappingURL=routes.js.map