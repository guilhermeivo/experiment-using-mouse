import app from '@Api/Common/Server'
import router from '@Api/routes'
import { openConnection } from '@Infrastructure/Persistence/connection'
import { migrateAsync } from '@Infrastructure/Persistence/migrate'
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
        origins: 'LINK_ORIGIN',
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
