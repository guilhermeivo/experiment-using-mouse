import * as http from 'node:http'
import * as dotenv from 'dotenv'
import migrate from './db/migrate'
import app from './common/Server'
dotenv.config()

const HOST = process.env.BASE_HOSTNAME || 'localhost'
const PORT = Number(process.env.BASE_PORT) || 8000
const CORS = process.env.BASE_HOSTNAME || ''

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.useCors({
        origins: CORS,
        headers: '*',
        methods: '*'
    })
} else {
    app.useCors({
        origins: CORS,
        headers: '*',
        methods: '*'
    })
}

app.useRouting(__dirname)

const server = http.createServer((requestHttp, response) => app.requestListener(requestHttp, response))
server.listen(PORT, () => {
    migrate()
    console.log(`Server is running on http://${ HOST }:${ PORT }`)
})