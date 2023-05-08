import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

const emailHost = process.env.EMAIL_HOST
const emailUser = process.env.EMAIL_USER
const emailPassword = process.env.EMAIL_PASSWORD

const nodeEnv = process.env.NODE_ENV

const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

export const isEmailValid = (email: string) => {
    if (!email) return false

    if (email.length > 254) return false
    
    let valid = emailRegex.test(email)
    if (!valid) return false

    let parts = email.split('@')
    if (parts[0].length > 64) return false

    let domainParts = parts[1].split('.')
    if (domainParts.some((part) => { return part.length > 63 })) return false

    return true
}

export const sendMail = async (mailOptions: object) => {
    let configOptions = {
        host: emailHost,
        port: 587,
        auth: {
            user: emailUser, 
            pass: emailPassword,
        }
    }

    const transport = nodemailer.createTransport(configOptions)

    return transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error(error)
        }

        if (nodeEnv === 'DEVELOPMENT') {
            // Preview only available when sending through an Ethereal account
            console.log(`Preview URL: ${ nodemailer.getTestMessageUrl(info) }`)
        }
    })
}