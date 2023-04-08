import * as http from 'node:http'
import Response from '@Application/Common/Models/Response'
import StatusCodes from '@Api/Common/Enumerations/StatusCodes'
import TypesRequests from '@Api/Common/Enumerations/TypesRequests'
import { OptionsCors, defaults } from '@Api/Common/Interfaces/OptionsCors'
import RoutesResponse from '@Api/Common/Interfaces/RoutesResponse'
import UrlParser from '@Infrastructure/Common/UrlParser'

export default abstract class Server {
    
    static hostname: string
    static port: number
    static corsConfigurations: OptionsCors = { ...defaults }
    static routes: Array<RoutesResponse> = []
    static authenticationHandler: Function

    public static listen(port: number, hostname: string) {
        const httpServer = http.createServer(async (request, response) => {  
            const headers = {
                'Access-Control-Allow-Origin': this.corsConfigurations.origins,
                'Access-Control-Allow-Methods': this.corsConfigurations.methods,
                'Access-Control-Allow-Headers': this.corsConfigurations.headers,
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': 2592000,
                'Content-Type': 'application/json'
            }

            let responseBodyResponse: any

            await this.authenticationHandler(request, response)
            
            this.routes.map(async (route) => {
                const urlComponents = UrlParser(request.url || '')

                switch (route.typeRequest) {
                    case TypesRequests.Route:
                        if (urlComponents.path.substring(0, urlComponents.path.lastIndexOf('/')) === route.url && 
                            request.method === route.methods) {
                            const routeParam = route.queryRoute || ''
                            const queryString = urlComponents.path.substring(
                                urlComponents.path.lastIndexOf('/') + 1, 
                                urlComponents.path.length)
                            
                            urlComponents.queries[routeParam] = queryString
                            responseBodyResponse = await route.callback(urlComponents.queries, request, response)

                            response.writeHead(StatusCodes.Success, headers)
                            response.end(JSON.stringify(responseBodyResponse))
                        }
                        break
                    case TypesRequests.Query:
                        if (urlComponents.path === route.url && request.method === route.methods) {
                            responseBodyResponse = await route.callback(urlComponents.queries, request, response)

                            response.writeHead(StatusCodes.Success, headers)
                            response.end(JSON.stringify(responseBodyResponse))
                        }
                        break
                    case TypesRequests.Body:
                        break
                }
            })

            /*if (!responseBodyResponse) {
                response.writeHead(StatusCodes.NotFound, headers)
                response.end(JSON.stringify(new Response<string>('Route not found')))
            }*/
        })

        this.port = port
        this.hostname = hostname

        httpServer.listen(this.port, () => {
            console.log(`Server running at ${ this.hostname }:${ this.port }/`)
        }).on('error', (error: Error) => {
            console.error(error.message)
            throw error
        })
    }

    public static useCors(options: OptionsCors) {
        for (const key in options) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                let option = options[key as keyof OptionsCors]
                if (typeof option === 'object') option = option.join(', ')
                this.corsConfigurations[key as keyof OptionsCors] = option
            }
        }
    }

    public static useRouting(routes: Array<RoutesResponse>) {
        routes.map(route => {
            if (route.url.includes('{') && route.url.includes('}')) {
                // path/to/{value}
                let routePath = route.url.substring(0, route.url.lastIndexOf('/'))
                let routeParam = route.url.substring(route.url.indexOf('{') + 1, route.url.indexOf('}'))

                route.queryRoute = routeParam
                this.routes.push({ ...route, url: routePath, queryRoute: route.queryRoute, typeRequest: TypesRequests.Route })
            } else {
                // path/to?value=value
                this.routes.push({ ...route, typeRequest: TypesRequests.Query })
            }
        })
    }

    public static addAuthentication(callback: Function) {
        this.authenticationHandler = callback
    }

    public static router() {
        let routes: Array<RoutesResponse> = []
        return {
            useAuthentication: true,
            routes: routes,
            get: (urlPath: string, callback: Function) => {
                routes.push({ url: urlPath, methods: 'GET', callback: callback })
            },
            post: (urlPath: string, callback: Function) => {
                routes.push({ url: urlPath, methods: 'POST', callback: callback })
            },
            put: (urlPath: string, callback: Function) => {
                routes.push({ url: urlPath, methods: 'PUT', callback: callback })
            }
        }
    }
}