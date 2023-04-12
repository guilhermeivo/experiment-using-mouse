import app from '@Api/Common/Server'
import router from '@Api/routes'
import { openConnection } from '@Infrastructure/Persistence/Connection'
import { migrateAsync } from '@Infrastructure/Persistence/Migrate'
import AuthenticationConfiguration from '@Infrastructure/Common/Configuration/AuthenticationConfiguration'
require('dotenv').config()

const PORT = Number(process.env.PORT) || 8000
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1'

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.useCors({
        origins: 'http://localhost:5173',
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
app.addAuthentication(AuthenticationConfiguration)

openConnection().then(() => {
    migrateAsync()
    app.listen(PORT, HOSTNAME)
})
