import Response from '@Application/Common/Models/Response'
import { Interaction, Maze } from '@Infrastructure/Persistence/Connection'
import MazeEntity from '@Domain/Entities/Maze'
import InteractionEntity from '@Domain/Entities/Interaction'
import MazeAddLikeEvent from '@Domain/Events/MazeAddLikeEvent'
import EnumTypeInteractions from '@Domain/Enumerations/EnumTypeInteractions'

export interface AddLikeMazeCommand {
    sessionId: string
    id: string
}

export abstract class AddLikeMazeCommandHandler {
    public static async handle(request: AddLikeMazeCommand) {
        try {
            if (!request.sessionId) throw new Error('Session invalid.')
            if (!request.id) throw new Error('Missing id.')

            var maze = [...await Maze.Where((x: MazeEntity) => x.id == request.id)][0]

            if (maze) {
                var foundInteractions = await Interaction.Where(
                    (x: InteractionEntity) => x.mazeId == request.id && x.sessionId == request.sessionId && x.type == EnumTypeInteractions.Liked.toString())
                    
                if (foundInteractions.length > 0) throw new Error('This session has already held a like in this maze.')
                
                const interaction: InteractionEntity = MazeAddLikeEvent({ sessionId: request.sessionId, mazeId: request.id })

                await Interaction.Add(interaction)
    
                return new Response<string>('Successfully added like.', request.id)
            } else {
                throw new Error('Invalid id.')
            }
        } catch (exception: any) {
            return new Response<string>(exception.message)
        }
    }
}