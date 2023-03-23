import * as http from 'node:http'
import IQuery from '@Application/Common/IQuery'

interface RoutesResponse {
    url: string,
    methods: string,
    callback: Function,
    queries?: Array<string>
}

export default abstract class Server {
    
    static hostname: string = '127.0.0.1'
    static port: number

    static httpServer: any

    static _routes: Array<RoutesResponse> = []

    public static init() {
        this.httpServer = http.createServer(this.requestListener)
    }

    private static async requestListener(request: any, response: any) {
        let responseBody:any

        Server._routes.map(route => {
            let path = ''
            if (request.url.includes('?')) path = request.url.split('?')[0]
            else path = request.url

            const queries: IQuery = {}
            
            // path/to/call/:id
            if (route.url.includes('{') && route.url.includes('}')) {
                let routePath = route.url.substring(0, route.url.lastIndexOf('/'))
                path = path.substring(0, path.lastIndexOf('/'))
                let routeParam = route.url.substring(route.url.indexOf('{') + 1, route.url.indexOf('}'))

                if (path === routePath && request.method === route.methods) {
                    let queryString = request.url.substring(route.url.lastIndexOf('/') + 1, request.url.length)
                    queries[routeParam] = queryString

                    response.writeHead(200, { 'Content-Type': 'application/json' })
                    responseBody = route.callback(queries, response)
                }
            // path/to/call?query=value
            } else {
                if (path === route.url && request.method === route.methods) {
                    if (request.url.includes('?')) {
                        let queryString = request.url.split('?')[1]
                        let queryParams = []
                        
                        if (queryString.includes('&')) {
                            queryParams = queryString.split('&')
                        } else {
                            queryParams.push(queryString)
                        }
                        queryParams.map((m: string) => m.split('=')).map((m: string) => {
                            queries[m[0]] = m[1]
                        })
                    }
                    response.writeHead(200, { 'Content-Type': 'application/json' })
                    responseBody = route.callback(queries, response)
                }
            }
        })
        if (!responseBody) responseBody = { message: 'Route not found' }
        response.end(JSON.stringify(await responseBody))
    }
    
    public static listen(port: number, callback: Function) {
        this.port = port
        this.httpServer.listen(this.port, this.hostname, callback())
    }

    public static use(routes: any) {
        this._routes = routes.routes
    }

    public static router() {
        let routes: Array<RoutesResponse> = []
        return {
            routes: routes,
            get: (urlPath: string, callback: Function) => {
                routes.push({ url: urlPath, methods: 'GET', callback: callback })
            },
            post: (urlPath: string, callback: Function) => {
                routes.push({ url: urlPath, methods: 'POST', callback: callback })
            }
        }
    }
}