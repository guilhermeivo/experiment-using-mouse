import path from "path"
import enumTypeInteractions from "../common/enumerations/enumTypeInteractions"
import controllerProps from "../common/interfaces/controllerProps"
import Result from "../common/models/Result"
import authGuard from "../middleware/authGuard"
import interactionRepository from "../repository/interactionRepository"
import mazeRepository from "../repository/mazeRepository"
import * as fs from 'fs'
import fileRepository from "../repository/fileRepository"
import { sendMail } from "../common/helpers/mailHelper"
import { templateMail } from "../common/templates/templateMail"
import userRepository from "../repository/userRepository"
import PaginatedList from "../common/models/PaginatedList"
import maze from "../entities/maze"
import db from "../persistence"

const emailUser = process.env.EMAIL_USER

export default () => {
    interface requestGetWithPagination {
        userId: number
        pageNumber: number
        pageSize: number
    }

    const getWithPagination: controllerProps = {
        method: `GET('pagination')`,
        auth: authGuard,
        handle: async (request: requestGetWithPagination) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)
            if (!request.pageNumber || !request.pageSize) return new Result(`Not all data was provided.`)

            const mazeEntity = await mazeRepository.pagination(request.pageSize, request.pageNumber)
            const { count } = await mazeRepository.findAndCount()

            const result: Array<object> = []
            await Promise.all(
                mazeEntity.map(async maze => {
                    result.push(createResponseMaze(maze, request.userId))
                }))

            return new Result('maze', new PaginatedList<object>(result, count, request.pageNumber, request.pageSize))
        }
    }

    interface requestGetBySearchWithPagination {
        userId: number
        pageNumber: number
        pageSize: number
        q: string
        sortBy: string
        filters: string
    }

    const getBySearchWithPagination: controllerProps = {
        method: `GET('pagination/search')`,
        auth: authGuard,
        handle: async (request: requestGetBySearchWithPagination) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)
            if (!request.pageNumber || !request.pageSize) return new Result(`Not all data was provided.`)
            if (request.sortBy && !['alphabetical', 'releaseDate', 'likes'].includes(request.sortBy)) return new Result(`Not all data was provided.`)

            const mazeEntity = await mazeRepository.pagination(request.pageSize, request.pageNumber, {
                where: {
                    name: {
                        [db.operators.like]: `%${ request.q }%` 
                    }
                    
                }
            })
            const { count } = await mazeRepository.findAndCount({
                where: {
                    name: {
                        [db.operators.like]: `%${ request.q }%` 
                    }
                }
            })

            const result: Array<object> = []
            await Promise.all(
                mazeEntity.map(async maze => {
                    result.push(await createResponseMaze(maze, request.userId))
                }))

            return new Result('maze', new PaginatedList<any>(result, count, request.pageNumber, request.pageSize))
        }
    }

    const createResponseMaze = async (maze: maze, userId: number) => {
        const { count: amountLikes } = await interactionRepository.findAndCount({
            where: {
                mazeId: maze.id,
                type: enumTypeInteractions.Liked.toString()
            }
        })
        const { count: amountViews } = await interactionRepository.findAndCount({
            where: {
                mazeId: maze.id,
                type: enumTypeInteractions.Visualized.toString()
            }
        })
        const isLiked = await interactionRepository.find({
            where: {
                mazeId: maze.id,
                userId: userId,
                type: enumTypeInteractions.Liked.toString()
            }
        })
        const file = await fileRepository.findById(Number(maze.fileId))
        const findUser = await userRepository.findById(Number(maze.userId))

        try {
            const data = fs.readFileSync(path.join(__dirname, `/../${ file.filePath }/${ file.fileName }.json`), 'utf8')

            return {
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
            }
        } catch { 
            return { }
        } 
    }

    interface requestGetAll {
        userId: number
    }

    const getAll: controllerProps = {
        method: `GET`,
        auth: authGuard,
        handle: async (request: requestGetAll) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)

            const findMaze = await mazeRepository.find()

            const result: Array<object> = []
            await Promise.all(
                findMaze.map(async maze => {
                    result.push(await createResponseMaze(maze, request.userId))
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

            const findMaze = await mazeRepository.find({
                where: {
                    userId: request.userId
                }
            })
            if (findMaze.length <= 0) return new Result(`Could not find any matching values.`, [])

            const result: Array<object> = []
            await Promise.all(
                findMaze.map(async maze => {
                    result.push(await createResponseMaze(maze, request.userId))
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

            const findMaze = await mazeRepository.findById(request.id)
            if (!findMaze) return new Result(`Could not find any matching values.`)

            return new Result('Get Maze By Id!', await createResponseMaze(findMaze, request.userId))
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

            const findMaze = await mazeRepository.findById(request.id)
            if (!findMaze) return new Result(`Could not find any matching values.`)

            const findInteraction = await interactionRepository.find({
                where: {
                    userId: request.userId,
                    mazeId: request.id,
                    type: enumTypeInteractions.Liked.toString()
                }
            })
            if (findInteraction.length > 0) {
                const removeInteraction = interactionRepository.destroy({
                    where: {
                        userId: request.userId,
                        mazeId: request.id,
                        type: enumTypeInteractions.Liked.toString()
                    }
                })
                if (!removeInteraction) return new Result('An error occurred while executing the function.')

                return new Result('Removed like!', request.id)
            } else {
                const addLike = await interactionRepository.addLike(request.userId, request.id)
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

            const findMaze = await mazeRepository.findById(request.id)
            if (!findMaze) return new Result(`Could not find any matching values.`)

            const findInteraction = await interactionRepository.find({
                where: {
                    userId: request.userId,
                    mazeId: request.id,
                    type: enumTypeInteractions.Visualized.toString()
                }
            })
            if (findInteraction.length > 0) return new Result('This user has already performed this interaction.', request.id)

            const addView = await interactionRepository.addView(request.userId, request.id)
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
                if (!fs.existsSync(path.join(__dirname, `/../${ fileUpdate.filePath }/`))) {
                    fs.mkdirSync(path.join(__dirname, `/../${ fileUpdate.filePath }/`))
                }
                fs.writeFileSync(path.join(__dirname, `/../${ fileUpdate.filePath }/${ fileUpdate.fileName }.json`), request.object)
            } catch (err) {
                console.log(err)
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
                fs.writeFileSync(path.join(__dirname, `/../${ fileUpdate.filePath }/${ fileUpdate.fileName }.json`), request.object)
            } catch (err) {
                return new Result('An error occurred while executing the function.')
            }

            return new Result('The maze has been updated successfully.', request.id)
        }
    }

    return [ getAll, getByUser, getById, toggleLike, addView, create, update, getWithPagination, getBySearchWithPagination ]
}