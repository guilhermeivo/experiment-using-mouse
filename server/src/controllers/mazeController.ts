import enumTypeInteractions from "../common/enumerations/enumTypeInteractions"
import controllerProps from "../common/interfaces/controllerProps"
import Result from "../common/models/Result"
import interaction from "../entities/interaction"
import maze from "../entities/maze"
import authGuard from "../middleware/authGuard"
import interactionRepository from "../repository/interactionRepository"
import mazeRepository from "../repository/mazeRepository"

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
    
                    result.push({
                        id: maze.id,
                        name: maze.name,
                        description: maze.description,
                        like: amountLikes,
                        view: amountViews,
                        isLiked: isLiked.length ? true : false,
                        createdAt: maze.createdAt,
                        image: maze.image
                    })
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
    
                    result.push({
                        id: maze.id,
                        name: maze.name,
                        description: maze.description,
                        like: amountLikes,
                        view: amountViews,
                        isLiked: isLiked.length ? true : false,
                        createdAt: maze.createdAt,
                        image: maze.image
                    })
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
    
                    result.push({
                        id: maze.id,
                        name: maze.name,
                        description: maze.description,
                        like: amountLikes,
                        view: amountViews,
                        isLiked: isLiked.length ? true : false,
                        createdAt: maze.createdAt,
                        image: maze.image
                    })
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
            if (findInteraction.length > 0) return new Result('This user has already performed this interaction.')

            const addView = await interactionRepository.AddView(request.userId, request.id)
            if (!addView) return new Result('An error occurred while executing the function.')

            return new Result('Add view!', request.id)
        }
    }

    interface requestCreate {
        userId: number
        name: string
        description: string
        image: string
        ip: string
    }

    const create: controllerProps = {
        method: `POST`,
        auth: authGuard,
        handle: async (request: requestCreate) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)
            if (!request.name || !request.description || !request.image) return new Result(`Not all data was provided.`)

            const currentTime = new Date()
            const addMaze = await mazeRepository.Add({
                userId : request.userId,
                name: request.name,
                description: request.description,
                image: request.image,
                createdAt: currentTime,
                createdByIp: request.ip
            })

            return new Result('Created!', addMaze.id)
        }
    }

    interface requestUpdate {
        id: number
        userId: number
        name: string
        description: string
        image: string
    }

    const update: controllerProps = {
        method: `POST('update')`,
        auth: authGuard,
        handle: async (request: requestUpdate) => {
            if (!request.userId) return new Result(`Invalid auth credentials.`)
            if (!request.id) return new Result(`Not all data was provided.`)

            const findMaze = await mazeRepository.Where((entity: maze) => entity.id == request.id && entity.userId == request.userId)
            if (findMaze.length <= 0) return new Result(`Could not find any matching values.`)

            const updateMaze = await mazeRepository.Update({
                name: request.name,
                description: request.name,
                image: request.image
            }, (entity: maze) => entity.id == request.id && entity.userId == request.userId)

            return new Result('Updated!', updateMaze.id)
        }
    }

    return [ getAll, getByUser, getById, toggleLike, addView, create, update ]
}