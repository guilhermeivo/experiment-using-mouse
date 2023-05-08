import * as fs from 'fs'
import * as path from 'path'
import * as http from 'node:http'
import Request from '../common/models/Request'
import Result from './models/Result'
import enumHttpStatusCode from './enumerations/enumHttpStatusCode'

interface OptionsConfigurations {
    origins: string,
    headers: string,
    methods: string
}

export default abstract class Server {
    static configurations: OptionsConfigurations = { 
        origins: 'null',
        headers: 'null',
        methods: 'null' 
    }
    static routes: Array<any> = []

    public static async requestListener(requestHttp: http.IncomingMessage, response: http.ServerResponse) {
        const request = new Request(requestHttp)
        await request.initialize()
    
        response.setHeader('Content-Type', 'application/json')
        response.setHeader('Access-Control-Allow-Methods', this.configurations.methods)
        response.setHeader('Access-Control-Allow-Headers', this.configurations.headers)
        response.setHeader('Access-Control-Allow-Origin', this.configurations.origins)
        response.setHeader('Access-Control-Max-Age', 2592000)
        response.setHeader('Access-Control-Allow-Credentials', 'true')

        new Promise<any>((resolve, reject) => {
            let isFind = false
    
            this.routes.map(async (controller) => {
                if (request.path === controller.path && request.method === controller.method) { 
                    isFind = true

                    let ip = requestHttp.headers['x-forwarded-for'] || requestHttp.socket.remoteAddress || null
                    let requestController = {...request.query, ...request.body, ...request.cookies, ip }
                    for (let i = 0; i < Object.keys(controller).length; i++) {
                        const key = Object.keys(controller)[i]
                        if (typeof controller[key] === 'function') {
                            
                            const result: Result<any> = await controller[key](requestController, response)

                            if (!result.Succeeded) return reject(result)

                            const isLastController = i >= Object.keys(controller).length - 1
                            if (isLastController) return resolve(result)
                            else requestController = {
                                ...requestController,
                                ...result.Data
                            }
                        }
                    }
                }
            })
            
            if (!isFind) return reject()
        })
        .then((result: Result<any>) => {
            if (result.Data.hasOwnProperty('redirectLocation')) {
                response.writeHead(enumHttpStatusCode.movedPermanently, { Location: result.Data.redirectLocation })
                return response.end()
            }
            response.writeHead(enumHttpStatusCode.ok)
            response.end(JSON.stringify(result))
        })
        .catch(exception => {
            response.writeHead(enumHttpStatusCode.notFound)
            response.end(JSON.stringify(exception || new Result('Resource not found')))
        })
    }

    public static useCors(options: OptionsConfigurations) {
        for (const key in options) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                this.configurations[key as keyof OptionsConfigurations] = options[key as keyof OptionsConfigurations]
            }
        }
    }

    public static useRouting(dirName: string) {
        const dirContents = fs.readdirSync(path.join(dirName, 'controllers/'), { encoding: 'utf-8' })
        dirContents.map(content => {
            if ((content.includes('.ts') || content.includes('.js')) && !content.includes('.map')) {
                const controller = require(path.join(dirName, `controllers/${ content }`)).default()
                controller.map((methods: any) => {
                    let path = content.split('Controller')[0].toLowerCase()
                    if (methods.method.includes('(') && methods.method.includes(')')) {
                        const subPath = methods.method.substring(
                            methods.method.indexOf(`'`) + 1, 
                            methods.method.lastIndexOf(`'`)
                        )
                        path += `/${ subPath }`
        
                        methods.method = methods.method.split('(')[0]
                    }
        
                    this.routes.push({
                        path: `/${ path }`,
                        ...methods
                    })
                })
            }
        })
    }
}