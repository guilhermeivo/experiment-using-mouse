import 'module-alias/register'
import app from '@Infrastructure/Common/Server'
import router from '@Api/routes'
import { openConnection } from '@Infrastructure/Persistence/connection'
import { migrateAsync } from '@Infrastructure/Persistence/migrate'
require('dotenv').config()

const PORT = Number(process.env.PORT) || 8000
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1'

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.useCors({
        origins: 'http://127.0.0.1:5500',
        headers: '*',
        methods: '*'
    })
} else {
    app.useCors({
        origins: 'https://guilhermeivo.github.io/experiment-using-mice',
        headers: '*',
        methods: '*'
    })
}

app.useRouting(router.routes)

openConnection().then(() => {
    migrateAsync()
    app.listen(PORT, HOSTNAME)
})
