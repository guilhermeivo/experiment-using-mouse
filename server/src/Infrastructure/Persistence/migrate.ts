import createMazes from '@Infrastructure/Persistence/migrations/01_create_mazes'
import createSession from '@Infrastructure/Persistence/migrations/02_create_session'

export async function migrateAsync() {
    await createSession()
    await createMazes()
}

export function migrate() {
    createSession()
    createMazes()
}