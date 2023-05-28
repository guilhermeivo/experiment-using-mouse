import Result from "../../../common/models/Result"
import fileRepository from "../../../repository/fileRepository"
import mazeRepository from "../../../repository/mazeRepository"
import * as fs from 'fs'
import path from "path"

interface requestUpdate {
    id: number
    userId: number
    name: string
    description: string
    object: string
    ip: string
}

export default async (request: requestUpdate) => {
    if (!request.userId) return new Result(`Invalid auth credentials.`)
    if (!request.id) return new Result(`Not all data was provided.`)

    const findMaze = await mazeRepository.findOne({
        where: {
            id: request.id,
            userId: request.userId
        }
    })
    if (!findMaze) return new Result(`Could not find any matching values.`)

    const updateMaze = await mazeRepository.update({
        name: request.name,
        description: request.name,
    }, {
        where: {
            id: request.id,
            userId: request.userId
        }
    })

    const currentTime = new Date()
    const fileUpdate = await fileRepository.update({
        size: new Blob([request.object]).size,
        updatedAt: currentTime,
        updatedByIp: request.ip
    }, {
        where: {
            id: findMaze.fileId
        }
    })

    try {
        fs.writeFileSync(path.join(__dirname, `/../../../${ fileUpdate.filePath }/${ fileUpdate.fileName }.json`), request.object)
    } catch (err) {
        return new Result('An error occurred while executing the function.')
    }

    return new Result('The maze has been updated successfully.', request.id)
}