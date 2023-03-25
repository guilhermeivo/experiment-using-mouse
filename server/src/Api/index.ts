import 'module-alias/register'
import app from '@Infrastructure/Common/Server'
import routes from '@Api/routes'
require('dotenv').config()

const PORT = Number(process.env.PORT) || 8000
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1'

app.init()
app.use(routes)
app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://127.0.0.1:${ PORT }/`)
})