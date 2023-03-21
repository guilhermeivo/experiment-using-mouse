import app from './common/Server'
import routes from './routes'

const PORT = 8000

app.init()
app.use(routes)
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${ PORT }/`)
})