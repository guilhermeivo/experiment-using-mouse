import enumTypeInteractions from "../../../common/enumerations/enumTypeInteractions"
import maze from "../../../entities/maze"
import fileRepository from "../../../repository/fileRepository"
import interactionRepository from "../../../repository/interactionRepository"
import * as fs from 'fs'
import path from "path"
import userRepository from "../../../repository/userRepository"

export default async (maze: maze, userId: number) => {
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