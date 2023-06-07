import { generateJwtToken } from "../common/helpers/jwtHelper"
import Result from "../common/models/Result"
import tokenRepository from "../repository/tokenRepository"
import userRepository from "../repository/userRepository"
import crypto from 'node:crypto'
import * as dotenv from 'dotenv'
import { templateMail } from "../common/templates/templateMail"
import { isEmailValid, sendMail } from "../common/helpers/mailHelper"
import * as http from 'node:http'
dotenv.config()

const emailUser = process.env.EMAIL_USER
const nodeEnv = process.env.NODE_ENV

interface requestAuthenticate {
    email: string
    otc: string // code
    realm: string // email
    ip: string
}

export const authenticateUser = async (request: requestAuthenticate, response?: http.ServerResponse): Promise<Result<object>> => {
    if (!request.email || !request.otc || !request.realm) return new Result(`Not all data was provided.`)

    const findUser = await userRepository.findByEmail(request.email)
    if (!findUser) return new Result(`Invalid auth credentials.`)

    const findCode = await tokenRepository.findOne({
        where: {
            userId: findUser.id,
            token: request.otc
        }
    })
    if (!findCode) return new Result(`Invalid auth credentials.`)

    const currentdate = new Date()
    if (findCode.expirationTime < currentdate) return new Result('Expired code.')
    if (findCode.revokedAt && findCode.revokedAt < currentdate) return new Result('Expired code.')

    if (findCode.token !== request.otc) return new Result(`Invalid auth credentials.`) 

    const updateToken = await tokenRepository.update({
        revokedAt: currentdate,
        revokedByIp: request.ip
    }, {
        where: {
            userId: findUser.id,
            token: request.otc
        }
    })

    if (!updateToken) return new Result('An error occurred while executing the function.')

    await tokenRepository.destroy({
        where: {
            userId: findUser.id,
            token: request.otc
        }
    })

    const date = new Date()
    date.setDate(date.getDate() + 1)
    const accessToken = generateJwtToken({ sub: findUser.id }, '24h')
    if (response) response.setHeader('Set-Cookie', `access_token=${ accessToken }; Path=/; HttpOnly; SameSite=None; Secure; Expires=${ date.toUTCString() }`)

    if (nodeEnv === 'DEVELOPMENT') console.log(`access_token=${ accessToken }`)

    return new Result<object>(`User has been validated.`, { auth: true, token_type: 'jwt', expires_in: 86400 })
}

interface requestLogin {
    connection: string // email
    email: string // connection=email
    send: string // code
    ip: string
}

export const loginUser = async (request: requestLogin): Promise<Result<number>> => {
    if (!request.connection || request.connection !== 'email') 
        return new Result(`The type of communication was not provided (email).`)
    if (request.connection === 'email' && !request.email)
        return new Result(`The form of communication was not provided.`)
    
    const findUser = await userRepository.findByEmail(request.email)
    if (!findUser) return new Result(`Invalid auth credentials.`)
    if (!findUser.emailConfirmed) return new Result(`Waiting for email confirmation.`)

    const currentTime = new Date()
    const expirationTime = new Date()
    expirationTime.setTime(currentTime.getTime() + (10 * 60 * 1000)) // 10 minutes

    const addToken = await tokenRepository.add({ 
        token: crypto.randomBytes(3).toString('hex'),
        userId: findUser.id,
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
        to: `${ findUser.username } <${ findUser.email }>`,
    }

    try {
        sendMail(mailOptions)
        return new Result<number>('Verification code send to e-mail.', findUser.id)
    } catch {
        return new Result(`Can't send code email.`)
    }
}

interface requestVerifyEmail {
    userId: string
    emailToken: string
}

export const verifyEmailUser = async (request: requestVerifyEmail): Promise<Result<number>> => {
    if (!request.userId || !request.emailToken) return new Result(`Not all data was provided.`)

    const findUser = await userRepository.findById(Number(request.userId))
    if (!findUser) return new Result(`Invalid auth credentials.`)
    
    const findToken = await tokenRepository.findOne({
        where: {
            userId: Number(request.userId),
            token: request.emailToken
        }
    })
    if (!findToken) return new Result(`Invalid auth credentials.`)

    const currentdate = new Date()
    if (findToken.expirationTime < currentdate) return new Result('Expired token.')
    if (findToken.revokedAt && findToken.revokedAt < currentdate) return new Result('Expired token.')

    const updateUser = await userRepository.update({
        emailConfirmed: true
    }, {
        where: {
            id: Number(request.userId)
        }
    })
    
    if (!updateUser) return new Result('An error occurred while executing the function.')

    await tokenRepository.destroy({
        where: {
            userId: Number(request.userId),
            token: request.emailToken
        }
    })

    return new Result<number>('Email confirmed successfully.', findUser.id)
}

interface requestRegister {
    username: string
    email: string
    ip: string
    redirectUri: string
}

export const registerUser = async (request: requestRegister): Promise<Result<number>> => {
    if (!request.email || !request.username || !request.redirectUri) return new Result(`Not all data was provided.`)
    if (!isEmailValid(request.email)) return new Result(`You didn't enter a valid email address.`)

    const emailExist = await userRepository.findByEmail(request.email)
    if (emailExist) return new Result(`There is already a registered user with this email adress.`)

    const currentTime = new Date()
    const addUser = await userRepository.add({
        email: request.email,
        username: request.username,
        createdAt: currentTime,
        emailConfirmed: false,
        createdByIp: request.ip
    })            
    if (!addUser) return new Result(`An error occurred while executing the function.`)

    const expirationTime = new Date()
    expirationTime.setTime(currentTime.getTime() + (10 * 60 * 1000)) // 10 minutes

    const addToken = await tokenRepository.add({
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
        return new Result<number>('A link to verify authenticity has been sent to your email.', addUser.id)
    } catch {
        return new Result(`Can't send confirmation email.`)
    }
}

export const logoutUser = async (): Promise<Result<number>> => { 
    return new Result<number>('Logout')
}