import { validateJwtToken } from "../common/helpers/jwtHelper"
import Result from "../common/models/Result"
import user from "../entities/user"
import userRepository from "../repository/userRepository"

interface requestAuthGuard {
    access_token: string
}

export default async (request: requestAuthGuard) => {
    const valid = validateJwtToken(request.access_token)
    if (!valid) return new Result('Invalid auth credentials.')

    const findUser: Array<user> = await userRepository.Where((entity: user) => entity.id === valid.sub)
    if (findUser.length <= 0) return new Result(`Invalid auth credentials.`)

    if (!valid.hasOwnProperty('sub')) return new Result(`Invalid auth credentials.`)

    return new Result('Success auth.', { 'userId': valid['sub'] }) // next flow
}