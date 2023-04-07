import Interaction from "@Domain/Entities/Interaction";
import EnumTypeInteractions from "@Domain/Enumerations/EnumTypeInteractions";

export default function MazeAddViewEvent(ids: { sessionId: string, mazeId: string }): Interaction {
    const { sessionId, mazeId } = ids

    const interaction: Interaction = {
        sessionId: sessionId,
        mazeId: mazeId,
        type: EnumTypeInteractions.Visualized.toString()
    }

    return interaction
}