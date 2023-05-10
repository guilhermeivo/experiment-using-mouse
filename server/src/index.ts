import * as http from 'node:http'
import * as dotenv from 'dotenv'
import migrate from './db/migrate'
import app from './common/Server'
dotenv.config()

const HOST = process.env.BASE_HOSTNAME || 'localhost'
const PORT = Number(process.env.BASE_PORT) || 8000

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.useCors({
        origins: 'http://localhost:5173',
        headers: '*',
        methods: '*'
    })
} else {
    app.useCors({
        origins: 'LINK_ORIGIN',
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