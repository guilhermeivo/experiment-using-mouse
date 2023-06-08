import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

const emailHost = process.env.EMAIL_HOST
const emailUser = process.env.EMAIL_USER
const emailPassword = process.env.EMAIL_PASSWORD
const emailPort = Number(process.env.EMAIL_PORT)

const nodeEnv = process.env.NODE_ENV

export const sendMail = async (mailOptions: object) => {
    const configOptions = {
        host: emailHost,
        port: emailPort,
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