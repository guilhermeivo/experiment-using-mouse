import path from "path"
import enumTypeInteractions from "../common/enumerations/enumTypeInteractions"
import controllerProps from "../common/interfaces/controllerProps"
import Result from "../common/models/Result"
import interaction from "../entities/interaction"
import maze from "../entities/maze"
import authGuard from "../middleware/authGuard"
import interactionRepository from "../repository/interactionRepository"
import mazeRepository from "../repository/mazeRepository"
import * as fs from 'fs'
import fileRepository from "../repository/fileRepository"
import file from "../entities/file"
import { sendMail } from "../common/helpers/mailHelper"
import { templateMail } from "../common/templates/templateMail"
import userRepository from "../repository/userRepository"
import user from "../entities/user"

const emailUser = process.env.EMAIL_USER

export default () => {
    interface requestGetAll {
        userId: number
    }

    const getAll: controllerProps = {
        method: `GET`,
        auth: authGuard,
        handle: async (request: requestGetAll) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)

            const findMaze = await mazeRepository.Find()

            const result: Array<object> = []
            await Promise.all(
                findMaze.map(async (maze: maze) => {
                    const amountLikes = await interactionRepository.Count((x: interaction) => x.mazeId == maze.id && x.type == enumTypeInteractions.Liked.toString())
                    const amountViews = await interactionRepository.Count((x: interaction) => x.mazeId == maze.id && x.type == enumTypeInteractions.Visualized.toString())
                    const isLiked = await interactionRepository.Where((x: interaction) => x.mazeId == maze.id && x.userId == request.userId && x.type == enumTypeInteractions.Liked.toString())
                    const file: file = [...await fileRepository.Where((x: file) => x.id === maze.fileId)][0]
                    const findUser: user = [...await userRepository.Where((entity: user) => entity.id === Number(maze.userId))][0]

                    try {
                        const data = fs.readFileSync(path.join(__dirname, `/../${ file.filePath }/${ file.fileName }.json`), 'utf8')

                        result.push({
                            id: maze.id,
                            name: maze.name,
                            description: maze.description,
                            like: amountLikes,
                            view: amountViews,
                            isLiked: isLiked.length ? true : false,
                            createdAt: maze.createdAt,
                            overworldMap: JSON.parse(data),
                            createdBy: {
                                username: findUser.username
                            }
                        })
                    } catch { }
                }))

            return new Result('Get All Mazes!', result)
        }
    }

    interface requestByUser {
        userId: number
    }

    const getByUser: controllerProps = {
        method: `GET('user')`,
        auth: authGuard,
        handle: async (request: requestByUser) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)

            const findMaze = await mazeRepository.Where((entity: maze) => entity.userId == request.userId)
            if (findMaze.length <= 0) return new Result(`Could not find any matching values.`, [])

            const result: Array<object> = []
            await Promise.all(
                findMaze.map(async (maze: maze) => {
                    const amountLikes = await interactionRepository.Count((x: interaction) => x.mazeId == maze.id && x.type == enumTypeInteractions.Liked.toString())
                    const amountViews = await interactionRepository.Count((x: interaction) => x.mazeId == maze.id && x.type == enumTypeInteractions.Visualized.toString())
                    const isLiked = await interactionRepository.Where((x: interaction) => x.mazeId == maze.id && x.userId == request.userId && x.type == enumTypeInteractions.Liked.toString())
                    const file: file = [...await fileRepository.Where((x: file) => x.id === maze.fileId)][0]

                    try {
                        const data = fs.readFileSync(path.join(__dirname, `/../${ file.filePath }/${ file.fileName }.json`), 'utf8')

                        result.push({
                            id: maze.id,
                            name: maze.name,
                            description: maze.description,
                            like: amountLikes,
                            view: amountViews,
                            isLiked: isLiked.length ? true : false,
                            createdAt: maze.createdAt,
                            overworldMap: JSON.parse(data)
                        })
                    } catch { }
                }))

            return new Result('Get Maze By User!', result)
        }
    }

    interface requestGetById {
        id: number
        userId: number
    }

    const getById: controllerProps = {
        method: `GET('id')`,
        auth: authGuard,
        handle: async (request: requestGetById) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)
            if (!request.id) return new Result(`Not all data was provided.`)

            const findMaze = await mazeRepository.Where((entity: maze) => entity.id == request.id)
            if (findMaze.length <= 0) return new Result(`Could not find any matching values.`)

            const result: Array<object> = []
            await Promise.all(
                findMaze.map(async (maze: maze) => {
                    const amountLikes = await interactionRepository.Count((x: interaction) => x.mazeId == maze.id && x.type == enumTypeInteractions.Liked.toString())
                    const amountViews = await interactionRepository.Count((x: interaction) => x.mazeId == maze.id && x.type == enumTypeInteractions.Visualized.toString())
                    const isLiked = await interactionRepository.Where((x: interaction) => x.mazeId == maze.id && x.userId == request.userId && x.type == enumTypeInteractions.Liked.toString())
                    const file: file = [...await fileRepository.Where((x: file) => x.id === maze.fileId)][0]

                    try {
                        const data = fs.readFileSync(path.join(__dirname, `/../${ file.filePath }/${ file.fileName }.json`), 'utf8')

                        result.push({
                            id: maze.id,
                            name: maze.name,
                            description: maze.description,
                            like: amountLikes,
                            view: amountViews,
                            isLiked: isLiked.length ? true : false,
                            createdAt: maze.createdAt,
                            overworldMap: JSON.parse(data)
                        })
                    } catch { }
                }))

            return new Result('Get Maze By Id!', result)
        }
    }

    interface requestToggleLike {
        id: number
        userId: number
    }

    const toggleLike: controllerProps = {
        method: `POST('like')`,
        auth: authGuard,
        handle: async (request: requestToggleLike) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)
            if (!request.id) return new Result(`Not all data was provided.`)

            const findMaze = await mazeRepository.Where((entity: maze) => entity.id == request.id)
            if (findMaze.length <= 0) return new Result(`Could not find any matching values.`)

            const findInteraction = await interactionRepository.Where((entity: interaction) => entity.userId == request.userId && entity.mazeId == request.id && entity.type === enumTypeInteractions.Liked.toString())
            if (findInteraction.length > 0) {
                const removeInteraction = interactionRepository.Remove((entity: interaction) => entity.userId == request.userId && entity.mazeId == request.id && entity.type === enumTypeInteractions.Liked.toString())
                if (!removeInteraction) return new Result('An error occurred while executing the function.')

                return new Result('Removed like!', request.id)
            } else {
                const addLike = await interactionRepository.AddLike(request.userId, request.id)
                if (!addLike) return new Result('An error occurred while executing the function.')

                return new Result('Add like!', request.id)
            }
        }
    }

    interface requestAddView {
        id: number
        userId: number
    }

    const addView: controllerProps = {
        method: `POST('view')`,
        auth: authGuard,
        handle: async (request: requestAddView) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)
            if (!request.id) return new Result(`Not all data was provided.`)

            const findMaze = await mazeRepository.Where((entity: maze) => entity.id == request.id)
            if (findMaze.length <= 0) return new Result(`Could not find any matching values.`)

            const findInteraction = await interactionRepository.Where((entity: interaction) => entity.userId == request.userId && entity.mazeId == request.id && entity.type === enumTypeInteractions.Visualized.toString())
            if (findInteraction.length > 0) return new Result('This user has already performed this interaction.', request.id)

            const addView = await interactionRepository.AddView(request.userId, request.id)
            if (!addView) return new Result('An error occurred while executing the function.')

            return new Result('Add view!', request.id)
        }
    }

    interface requestCreate {
        userId: number
        name: string
        description: string
        object: string
        ip: string
    }

    const create: controllerProps = {
        method: `POST`,
        auth: authGuard,
        handle: async (request: requestCreate) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)
            if (!request.name || !request.description || !request.object) return new Result(`Not all data was provided.`)

            const currentTime = new Date()

            const file = await fileRepository.Add({
                fileName: 'maze',
                contentType: 'application/json',
                filePath: 'uploads',
                size: new Blob([request.object]).size,
                createdAt: currentTime,
                createdByIp: request.ip
            })
            if (!file) return new Result('An error occurred while executing the function.')
            const fileUpdate = await fileRepository.Update({
                fileName: `maze--${ file.id }`
            }, (entity: file) => entity.id === file.id)
            try {
                if (!fs.existsSync(path.join(__dirname, `/../${ fileUpdate.filePath }/`))) {
                    fs.mkdirSync(path.join(__dirname, `/../${ fileUpdate.filePath }/`))
                }
                fs.writeFileSync(path.join(__dirname, `/../${ fileUpdate.filePath }/${ fileUpdate.fileName }.json`), request.object)
            } catch (err) {
                console.log(err)
                return new Result('An error occurred while executing the function.')
            }

            const maze = await mazeRepository.Add({
                userId : request.userId,
                fileId: fileUpdate.id,
                name: request.name,
                description: request.description,
                createdAt: currentTime,
                createdByIp: request.ip
            })

            if (!maze) return new Result('An error occurred while executing the function.')

            const findUser = await userRepository.Where((entity: user) => entity.id === Number(request.userId))
            if (findUser.length <= 0) return new Result(`Invalid auth credentials.`)

            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            const mailOptions = {
                from: `Experiment Using Mouse <${ emailUser }>`,
                html: templateMail(
                    'Maze has been successfully created',
                    `${ findUser[0].username }`,
                    `Maze created successfully in the day: <b>${ months[currentTime.getMonth()] } ${ currentTime.getDate() }</b>.`,
                    '', '', ''),
                subject: `subject`,
                to: `${ findUser[0].username } <${ findUser[0].email }>`,
            }

            try {
                sendMail(mailOptions)
            } catch {
                return new Result(`Can't send code email.`)
            }

            return new Result('Maze has been successfully created.', maze.id)
        }
    }

    interface requestUpdate {
        id: number
        userId: number
        name: string
        description: string
        object: string
        ip: string
    }

    const update: controllerProps = {
        method: `POST('update')`,
        auth: authGuard,
        handle: async (request: requestUpdate) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)
            if (!request.id) return new Result(`Not all data was provided.`)

            const findMaze: Array<maze> = await mazeRepository.Where((entity: maze) => entity.id == request.id && entity.userId == request.userId)
            if (findMaze.length <= 0) return new Result(`Could not find any matching values.`)

            const updateMaze = await mazeRepository.Update({
                name: request.name,
                description: request.name,
            }, (entity: maze) => entity.id == request.id && entity.userId == request.userId)

            const currentTime = new Date()
            const fileUpdate = await fileRepository.Update({
                size: new Blob([request.object]).size,
                updatedAt: currentTime,
                updatedByIp: request.ip
            }, (entity: file) => entity.id === findMaze[0].fileId)

            try {
                fs.writeFileSync(path.join(__dirname, `/../${ fileUpdate.filePath }/${ fileUpdate.fileName }.json`), request.object)
            } catch (err) {
                return new Result('An error occurred while executing the function.')
            }

            return new Result('The maze has been updated successfully.', request.id)
        }
    }

    return [ getAll, getByUser, getById, toggleLike, addView, create, update ]
}