import app from '@Infrastructure/Common/Server'
import routes from '@Api/routes'
require('dotenv').config()

const PORT = Number(process.env.PORT) || 8000

app.init()
app.use(routes)
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${ PORT }/`)
})