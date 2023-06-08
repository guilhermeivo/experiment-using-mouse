import Result from "../../../common/models/Result"
import fileRepository from "../../../repository/fileRepository"
import * as fs from 'fs'
import path from "path"
import mazeRepository from "../../../repository/mazeRepository"
import userRepository from "../../../repository/userRepository"
import { templateMail } from "../../../common/templates/templateMail"
import { sendMail } from "../../../common/helpers/mailHelper"
import validators from "@experiment-using-mouse/validators"

const emailUser = process.env.EMAIL_USER

interface requestCreate {
    userId: number
    name: string
    description: string
    object: string
    ip: string
}

export default async (request: requestCreate): Promise<Result<number>> => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)
    if (!request.name || !request.description || !request.object) return new Result(`Not all data was provided.`)

    if (!validators.isNotSpecialCharacters(request.name)) return new Result(`You didn't enter a valid name.`)
    if (!validators.isPossibleMaze(JSON.parse(request.object))) return new Result(`You didn't enter a valid object.`)

    const currentTime = new Date()

    const file = await fileRepository.add({
        fileName: 'maze',
        contentType: 'application/json',
        filePath: 'uploads',
        size: new Blob([request.object]).size,
        createdAt: currentTime,
        createdByIp: request.ip
    })
    if (!file) return new Result('An error occurred while executing the function.')
    const fileUpdate = await fileRepository.update({
        fileName: `maze--${ file.id }`
    }, {
        where: {
            id: file.id
        }
    })
    try {
        if (!fs.existsSync(path.join(__dirname, `/../../../${ fileUpdate.filePath }/`))) {
            fs.mkdirSync(path.join(__dirname, `/../../../${ fileUpdate.filePath }/`))
        }
        fs.writeFileSync(path.join(__dirname, `/../../../${ fileUpdate.filePath }/${ fileUpdate.fileName }.json`), request.object)
    } catch {
        return new Result('An error occurred while executing the function.')
    }

    const maze = await mazeRepository.add({
        userId : request.userId,
        fileId: fileUpdate.id,
        name: request.name,
        description: request.description,
        createdAt: currentTime,
        createdByIp: request.ip
    })

    if (!maze) return new Result('An error occurred while executing the function.')

    const findUser = await userRepository.findById(Number(request.userId))

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const mailOptions = {
        from: `Experiment Using Mouse <${ emailUser }>`,
        html: templateMail(
            'Maze has been successfully created',
            `${ findUser.username }`,
            `Maze created successfully in the day: <b>${ months[currentTime.getMonth()] } ${ currentTime.getDate() }</b>.`,
            '', '', ''),
        subject: `Maze has been successfully created`,
        to: `${ findUser.username } <${ findUser.email }>`,
    }

    try {
        sendMail(mailOptions)
    } catch {
        return new Result(`Can't send code email.`)
    }

    return new Result<number>('Maze has been successfully created.', maze.id)
}