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
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("node:http"));
class Server {
    static init() {
        this.httpServer = http.createServer(this.requestListener);
    }
    static requestListener(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                "Access-Control-Allow-Headers": "Content-Type",
                'Access-Control-Max-Age': 2592000,
                'Content-Type': 'application/json',
            };
            let responseBody;
            Server._routes.map(route => {
                let path = '';
                if (request.url.includes('?'))
                    path = request.url.split('?')[0];
                else
                    path = request.url;
                const queries = {};
                // path/to/call/:id
                if (route.url.includes('{') && route.url.includes('}')) {
                    let routePath = route.url.substring(0, route.url.lastIndexOf('/'));
                    path = path.substring(0, path.lastIndexOf('/'));
                    let routeParam = route.url.substring(route.url.indexOf('{') + 1, route.url.indexOf('}'));
                    if (path === routePath && request.method === route.methods) {
                        let queryString = request.url.substring(route.url.lastIndexOf('/') + 1, request.url.length);
                        queries[routeParam] = queryString;
                        response.writeHead(200, headers);
                        responseBody = route.callback(queries, response);
                    }
                    // path/to/call?query=value
                }
                else {
                    if (path === route.url && request.method === route.methods) {
                        if (request.url.includes('?')) {
                            let queryString = request.url.split('?')[1];
                            let queryParams = [];
                            if (queryString.includes('&')) {
                                queryParams = queryString.split('&');
                            }
                            else {
                                queryParams.push(queryString);
                            }
                            queryParams.map((m) => m.split('=')).map((m) => {
                                queries[m[0]] = m[1];
                            });
                        }
                        response.writeHead(200, headers);
                        responseBody = route.callback(queries, response);
                    }
                }
            });
            if (!responseBody) {
                response.writeHead(400, headers);
                responseBody = { message: 'Route not found' };
            }
            response.end(JSON.stringify(yield responseBody));
        });
    }
    static listen(port, hostname, callback) {
        this.port = port;
        this.hostname = hostname;
        this.httpServer.listen(this.port, callback()).on('error', (error) => {
            console.error(error.message);
            throw error;
        });
    }
    static use(routes) {
        this._routes = routes.routes;
    }
    static router() {
        let routes = [];
        return {
            routes: routes,
            get: (urlPath, callback) => {
                routes.push({ url: urlPath, methods: 'GET', callback: callback });
            },
            post: (urlPath, callback) => {
                routes.push({ url: urlPath, methods: 'POST', callback: callback });
            }
        };
    }
}
Server._routes = [];
exports.default = Server;
//# sourceMappingURL=Server.js.map