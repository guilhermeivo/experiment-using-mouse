import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

const jwtSecretKey = process.env.JWT_SECRET_KEY || ''

export const generateJwtToken = (payload: object, expiresIn: string) => {
    return jwt.sign(payload, jwtSecretKey, { expiresIn })
}

export const validateJwtToken = (token: string) => {
    try {
        return jwt.verify(token, jwtSecretKey)
    } catch {
        return undefined
    }
}