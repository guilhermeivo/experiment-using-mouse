import createMazes from '@Infrastructure/Persistence/Migrations/01_create_mazes'
import createSession from '@Infrastructure/Persistence/Migrations/02_create_session'
import createInteraction from '@Infrastructure/Persistence/Migrations/03_create_interaction'

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