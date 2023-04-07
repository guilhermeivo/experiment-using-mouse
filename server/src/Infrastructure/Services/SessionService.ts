import Session from '@Domain/Entities/Session'
import { _context } from '@Infrastructure/Persistence/Connection'

export default abstract class SessionService {
    public static async CreateTokenSession(): Promise<string> {
        const token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            var r = Math.random() * 16 | 0, v = char == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })

        try {
            const result: string = await new Promise((resolve, reject) => {
                const sqlInsert = `insert into session (token)
                    values ('${ token }')`

                _context.serialize(() => {
                    return _context.run(sqlInsert, function(error) {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        return resolve(this.lastID.toString())
                    })
                })
            })

            return token
        } catch (exception: any) { 
            return ''
        }
    }

    public static async ValidateTokenSession(token: string): Promise<boolean> {
        try {
            return await new Promise((resolve, reject) => {
                const sqlSelect = `select token from session
                    where session.token = '${ token }'`

                _context.serialize(() => {
                    return _context.all(sqlSelect, function(error, rows: Array<Session>) {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }

                        return resolve(rows.length > 0 ? true : false)
                    })
                })
            })
        } catch (exception: any) { 
            return false
        }
    }
}