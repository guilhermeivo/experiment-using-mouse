import * as http from 'node:http'
import * as dotenv from 'dotenv'
import app from './common/Server'
import db from './persistence'
dotenv.config()

const HOST = process.env.BASE_HOSTNAME || 'localhost'
const PORT = Number(process.env.BASE_PORT) || 8080
const CORS = process.env.CORS_URL || ''

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
    db.initialize()
    console.log(`Server is running on http://${ HOST }:${ PORT }`)
})

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit())
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('SIGUSR2', gracefulShutdown)