"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("node:http"));
const Response_1 = __importDefault(require("@Application/Common/Models/Response"));
const StatusCodes_1 = __importDefault(require("@Infrastructure/Common/Enumerations/StatusCodes"));
const TypesRequests_1 = __importDefault(require("@Infrastructure/Common/Enumerations/TypesRequests"));
const OptionsCors_1 = require("@Infrastructure/Common/Interfaces/OptionsCors");
const UrlParser_1 = __importDefault(require("@Infrastructure/Common/UrlParser"));
class Server {
    static listen(port, hostname) {
        const httpServer = http.createServer((request, response) => __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Access-Control-Allow-Origin': this.corsConfigurations.origins,
                'Access-Control-Allow-Methods': this.corsConfigurations.methods,
                "Access-Control-Allow-Headers": this.corsConfigurations.headers,
                'Access-Control-Max-Age': 2592000,
                'Content-Type': 'application/json'
            };
            let responseBodyResponse;
            this.routes.map((route) => {
                const urlComponents = (0, UrlParser_1.default)(request.url || '');
                switch (route.typeRequest) {
                    case TypesRequests_1.default.Route:
                        if (urlComponents.path.substring(0, urlComponents.path.lastIndexOf('/')) === route.url &&
                            request.method === route.methods) {
                            const routeParam = route.queryRoute || '';
                            const queryString = urlComponents.path.substring(urlComponents.path.lastIndexOf('/') + 1, urlComponents.path.length);
                            urlComponents.queries[routeParam] = queryString;
                            responseBodyResponse = route.callback(urlComponents.queries, request, response);
                        }
                        break;
                    case TypesRequests_1.default.Query:
                        if (urlComponents.path === route.url && request.method === route.methods) {
                            responseBodyResponse = route.callback(urlComponents.queries, request, response);
                        }
                        break;
                    case TypesRequests_1.default.Body:
                        break;
                }
            });
            if (!responseBodyResponse) {
                response.writeHead(StatusCodes_1.default.NotFound, headers);
                response.end(JSON.stringify(new Response_1.default('Route not found')));
            }
            yield responseBodyResponse;
            response.writeHead(StatusCodes_1.default.Success, headers);
            response.end(JSON.stringify(yield responseBodyResponse));
        }));
        this.port = port;
        this.hostname = hostname;
        httpServer.listen(this.port, () => {
            console.log(`Server running at ${this.hostname}:${this.port}/`);
        }).on('error', (error) => {
            console.error(error.message);
            throw error;
        });
    }
    static useCors(options) {
        for (const key in options) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                let option = options[key];
                if (typeof option === 'object')
                    option = option.join(', ');
                this.corsConfigurations[key] = option;
            }
        }
    }
    static useRouting(routes) {
        routes.map(route => {
            if (route.url.includes('{') && route.url.includes('}')) {
                // path/to/{value}
                let routePath = route.url.substring(0, route.url.lastIndexOf('/'));
                let routeParam = route.url.substring(route.url.indexOf('{') + 1, route.url.indexOf('}'));
                route.queryRoute = routeParam;
                this.routes.push(Object.assign(Object.assign({}, route), { url: routePath, queryRoute: route.queryRoute, typeRequest: TypesRequests_1.default.Route }));
            }
            else {
                // // path/to?value=value
                this.routes.push(Object.assign(Object.assign({}, route), { typeRequest: TypesRequests_1.default.Query }));
            }
        });
    }
    static router() {
        let routes = [];
        return {
            useAuthentication: true,
            routes: routes,
            get: (urlPath, callback, authentication = false) => {
                routes.push({ url: urlPath, methods: 'GET', callback: callback, authentication: authentication });
            },
            post: (urlPath, callback, authentication = false) => {
                routes.push({ url: urlPath, methods: 'POST', callback: callback, authentication: authentication });
            },
            put: (urlPath, callback, authentication = false) => {
                routes.push({ url: urlPath, methods: 'PUT', callback: callback, authentication: authentication });
            }
        };
    }
}
Server.corsConfigurations = Object.assign({}, OptionsCors_1.defaults);
Server.routes = [];
exports.default = Server;
//# sourceMappingURL=Server.js.map