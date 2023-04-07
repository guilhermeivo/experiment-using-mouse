import Session from "@Infrastructure/Identity/ApplicationSession"
import { _context } from '@Infrastructure/Persistence/Connection'
import { resolve } from "path"

export default abstract class SessionService {
    public static async CreateTokenSession(): Promise<string> {
        const token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            var r = Math.random() * 16 | 0, v = char == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })

        try {
            const result: string = await new Promise((resolve, reject) => {
                const sqlInsert = `insert into session (token, createdOn)
                    values ('${ token }', '${ new Date().toISOString() }')`

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
            const validateToken: Array<Session> = await new Promise((resolve, reject) => {
                const sqlSelect = `select * from session
                    where session.token = '${ token }'`

                _context.serialize(() => {
                    return _context.all(sqlSelect, function(error, rows: Array<Session>) {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }

                        return resolve(rows)
                    })
                })
            })

            return validateToken.length > 0 && !validateToken[0].revokedOn ? true : false
        } catch (exception: any) { 
            return false
        }
    }

    public static async GetTokenSession(token: string): Promise<Session | null> {
        try {
            return await new Promise((resolve, reject) => {
                const sqlSelect = `select * from session
                    where session.token = '${ token }'`

                _context.serialize(() => {
                    return _context.get(sqlSelect, function(error, row: Session) {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }
                        
                        return resolve(row)
                    })
                })
            })
        } catch (exception: any) { 
            return null
        }
    }

    public static async RevokeTokenSession(token: string): Promise<boolean> {
        try { 
            return await new Promise((resolve, reject) => {
                const sqlSelect = `update session 
                    set revokedOn = '${ new Date().toISOString() }'
                        where session.token = '${ token }'`

                _context.serialize(() => {
                    return _context.run(sqlSelect, function(error) {
                        if (error) {
                            console.error(error.message)
                            return reject(error.message)
                        }

                        return resolve(true)
                    })
                })
            })
        } catch (exception: any) {  
            return false
        }
    }
}