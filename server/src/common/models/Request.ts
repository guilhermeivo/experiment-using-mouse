import * as http from 'node:http'
import urlParser from '../urlParser'
import cookieParser from '../cookieParser'

export default class Request {
    private requestHttp:  http.IncomingMessage

    body: object = { }
    headers: http.IncomingHttpHeaders = { }
    method: string | undefined = ''
    path = ''
    query: object = { }
    cookies: object = { }
    
    constructor(requestHttp: http.IncomingMessage) {
        this.requestHttp = requestHttp
    }

    async initialize() {
        const urlComponents = urlParser(this.requestHttp.url || '')
        this.body = await this.getBodyForRequestHttp(this.requestHttp)
        this.headers = this.requestHttp.headers
        this.method = this.requestHttp.method
        this.path = urlComponents.path
        this.query = urlComponents.parameters
        this.cookies = cookieParser(this.requestHttp.headers?.cookie || '')
    }

    private getBodyForRequestHttp(requestHttp: http.IncomingMessage): Promise<object> {
        const bodyChunk: Array<any> = []
        
        return new Promise(resolve => {
            requestHttp.on('data', chunk => {
                bodyChunk.push(chunk)
            }).on('end', () => {
                const parsedBody = Buffer.concat(bodyChunk).toString() || '{}'
                resolve(JSON.parse(parsedBody))
            })
        })
    }
}