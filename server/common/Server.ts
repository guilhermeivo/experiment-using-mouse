import * as http from 'node:http'
import IQuery from './IQuery'

interface Response {
    url: string,
    methods: string,
    callback: Function
}

export default abstract class Server {
    
    static hostname: string = '127.0.0.1'
    static port: number

    static httpServer: any

    static _routes: Array<Response> = []

    public static init() {
        this.httpServer = http.createServer(this.requestListener)
    }

    private static requestListener(request: any, response: any) {
        let responseBody
        Server._routes.map(route => {
            let path = ''
            if (request.url.includes('?')) path = request.url.split('?')[0]
            else path = request.url

            if (path === route.url && request.method === route.methods) {
                const queries: IQuery = {}
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
            } else {
                response.writeHead(404, { 'Content-Type': 'application/json' })
                responseBody = { message: 'Not found'}
            }
        })
        response.end(JSON.stringify(responseBody))
    }
    
    public static listen(port: number, callback: Function) {
        this.port = port
        this.httpServer.listen(this.port, this.hostname, callback())
    }

    public static use(routes: any) {
        this._routes = routes.routes
    }

    public static router() {
        let routes: Array<Response> = []
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