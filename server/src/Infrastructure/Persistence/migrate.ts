import createMazes from '@Infrastructure/Persistence/migrations/01_create_mazes'
import createSession from '@Infrastructure/Persistence/migrations/02_create_session'
import createInteraction from '@Infrastructure/Persistence/migrations/03_create_interaction'

export async function migrateAsync() {
    await createSession()
    await createMazes()
    await createInteraction()
}

export function migrate() {
    createSession()
    createMazes()
    createInteraction()
}