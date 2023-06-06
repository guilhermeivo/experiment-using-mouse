import * as sqlite from './sqlite'
import * as mysql from './mysql'

export default (() => {
    if (process.env.MYSQL_HOST) return mysql
    else return sqlite
})()