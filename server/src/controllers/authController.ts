import Result from "../common/models/Result"
import controllerProps from "../common/interfaces/controllerProps"
import { isEmailValid, sendMail } from "../common/helpers/mailHelper"
import user from "../entities/user"
import userRepository from "../repository/userRepository"
import crypto from 'node:crypto'
import token from "../entities/token"
import tokenRepository from "../repository/tokenRepository"
import * as dotenv from 'dotenv'
import { generateJwtToken } from "../common/helpers/jwtHelper"
import { templateMail } from "../common/templates/templateMail"
dotenv.config()

const baseUrl = process.env.BASE_URL
const emailUser = process.env.EMAIL_USER

export default () => {
    interface requestRegister {
        username: string
        email: string
        ip: string
        redirectUri: string
    }

    const register: controllerProps = {
        method: `POST('register')`,
        async handle(request: requestRegister) {
            if (!request.email || !request.username || !request.redirectUri) return new Result(`Not all data was provided.`)
            if (!isEmailValid(request.email)) return new Result(`You didn't enter a valid email address.`)

            const emailExist: Array<user> = await userRepository.Where((entity: user) => entity.email === request.email)
            if (emailExist.length > 0) return new Result(`There is already a registered user with this email adress.`)

            const currentTime = new Date()
            const addUser = await userRepository.Add({
                email: request.email,
                username: request.username,
                createdAt: currentTime,
                emailConfirmed: false,
                createdByIp: request.ip
            })
            
            if (!addUser) return new Result(`An error occurred while executing the function.`)

            const expirationTime = new Date()
            expirationTime.setTime(currentTime.getTime() + (10 * 60 * 1000)) // 10 minutes

            const addToken = await tokenRepository.Add({
                userId: addUser.id,
                token: crypto.randomBytes(32).toString('hex'),
                expirationTime: expirationTime,
                createdAt: currentTime,
                type: 'email',
                createdByIp: request.ip
            })

            if (!addToken) return new Result(`An error occurred while executing the function.`)
            
            const mailOptions = {
                from: `Experiment Using Mouse <${ emailUser }>`,
                html: templateMail(
                    'Your Verification Link',
                    request.email,
                    'Experiment using mouse received a registration request with email. Use this link to complete initial account setup:',
                    'The link is valid for 10 minutes.',
                    `${ request.redirectUri }?userId=${ addUser.id }&emailToken=${ addToken.token }`,
                    'Click Here!'),
                subject: 'Your Verification Link',
                to: `${ request.username } <${ request.email }>`,
            }

            try {
                sendMail(mailOptions)
                return new Result('A link to verify authenticity has been sent to your email.', addUser.id)
            } catch {
                return new Result(`Can't send confirmation email.`)
            }            
        }
    }

    const logout: controllerProps = {
        method: `POST('logout')`,
        async handle() { 
            return new Result('Logout')
        }
    }

    interface requestVerifyEmail {
        userId: string
        emailToken: string
    }

    const verifyEmail: controllerProps = {
        method: `POST('verify-email')`,
        async handle(request: requestVerifyEmail) {
            if (!request.userId || !request.emailToken) return new Result(`Not all data was provided.`)

            const findUser: Array<user> = await userRepository.Where((entity: user) => entity.id === Number(request.userId))
            if (findUser.length <= 0) return new Result(`Invalid auth credentials.`)
            
            const findToken: Array<token> = await tokenRepository.Where((entity: token) => entity.userId === Number(request.userId) && entity.token === request.emailToken)
            if (findToken.length <= 0) return new Result(`Invalid auth credentials.`)

            const currentdate = new Date()
            if (findToken[0].expirationTime < currentdate) return new Result('Expired token.')
            if (findToken[0].revokedAt && findToken[0].revokedAt < currentdate) return new Result('Expired token.')

            const updateUser = await userRepository.Update({
                emailConfirmed: true
            }, (entity: user) => entity.id === Number(request.userId))
            
            if (!updateUser) return new Result('An error occurred while executing the function.')

            const removeToken = await tokenRepository.Remove((entity: token) => entity.userId === Number(request.userId) && entity.token === request.emailToken)
            if (!removeToken) return new Result('An error occurred while executing the function.')

            return new Result('Email confirmed successfully.', findUser[0].id)
        }
    }

    interface requestLogin {
        connection: string // email
        email: string // connection=email
        send: string // code
        ip: string
    }

    const login: controllerProps = {
        method: `POST('login')`,
        async handle(request: requestLogin) {
            if (!request.connection || request.connection !== 'email') 
                return new Result(`The type of communication was not provided (email).`)
            if (request.connection === 'email' && !request.email)
                return new Result(`The form of communication was not provided.`)
            
            const findUser: Array<user> = await userRepository.Where((entity: user) => entity.email === request.email)
            if (findUser.length <= 0) return new Result(`Invalid auth credentials.`)
            if (!findUser[0].emailConfirmed) return new Result(`Waiting for email confirmation.`)

            const currentTime = new Date()
            const expirationTime = new Date()
            expirationTime.setTime(currentTime.getTime() + (10 * 60 * 1000)) // 10 minutes

            const addToken = await tokenRepository.Add({ 
                token: crypto.randomBytes(3).toString('hex'),
                userId: findUser[0].id,
                expirationTime: expirationTime,
                createdAt: currentTime,
                type: 'otc',
                createdByIp: request.ip
            })

            if (!addToken) return new Result(`An error occurred while executing the function.`)


            const mailOptions = {
                from: `Experiment Using Mouse <${ emailUser }>`,
                html: templateMail(
                    'Email verification code',
                    request.email,
                    `Your verification code is <b>${ addToken.token }</b>`,
                    'The link is valid for 10 minutes.', 
                    '', ''),
                subject: `Email verification code: ${ addToken.token }`,
                to: `${ findUser[0].username } <${ findUser[0].email }>`,
            }

            try {
                sendMail(mailOptions)
                return new Result('Verification code send to e-mail.', findUser[0].id)
            } catch {
                return new Result(`Can't send code email.`)
            }
        }
    }

    interface requestAuthenticate {
        email: string
        otc: string // code
        realm: string // email
        ip: string
    }

    const authenticate: controllerProps = {
        method: `POST('authenticate')`,
        async handle(request: requestAuthenticate, response) {
            if (!request.email || !request.otc || !request.realm) return new Result(`Not all data was provided.`)

            const findUser: Array<user> = await userRepository.Where((entity: user) => entity.email === request.email)
            if (findUser.length <= 0) return new Result(`Invalid auth credentials.`)

            const findCode: Array<token> = await tokenRepository.Where((entity: token) => entity.userId == findUser[0].id && entity.token === request.otc)
            if (findCode.length <= 0) return new Result(`Invalid auth credentials.`)

            const currentdate = new Date()
            if (findCode[0].expirationTime < currentdate) return new Result('Expired code.')
            if (findCode[0].revokedAt && findCode[0].revokedAt < currentdate) return new Result('Expired code.')

            if (findCode[0].token !== request.otc) return new Result(`Invalid auth credentials.`) 

            const updateToken = await tokenRepository.Update({
                revokedAt: currentdate,
                revokedByIp: request.ip
            }, (entity: token) => entity.userId == findUser[0].id && entity.token === request.otc)

            if (!updateToken) return new Result('An error occurred while executing the function.')

            const removeToken = await tokenRepository.Remove((entity: token) => entity.userId == findUser[0].id && entity.token === request.otc)

            const accessToken = generateJwtToken({ sub: findUser[0].id }, '24h')
            if (response) response.setHeader('Set-Cookie', `access_token=${ accessToken }; Path=/; HttpOnly; SameSite=None; Secure`)

            return new Result<object>(`User has been validated.`, { auth: true, token_type: 'jwt', expires_in: 86400 })
        }
    }

    return [ register, logout, verifyEmail, login, authenticate ]
}