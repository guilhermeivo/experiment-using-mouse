import { validateJwtToken } from "../common/helpers/jwtHelper"
import Result from "../common/models/Result"
import userRepository from "../repository/userRepository"

interface requestAuthGuard {
    access_token: string
}

export default async (request: requestAuthGuard) => {
    const valid = validateJwtToken(request.access_token)
    if (!valid) return new Result('Invalid auth credentials.')

    const findUser = await userRepository.findById(Number(valid.sub))
    if (!findUser) return new Result(`Invalid auth credentials.`)
    if (!Object.hasOwnProperty.call(valid, 'sub')) return new Result(`Invalid auth credentials.`)

    return new Result('Success auth.', { 'userId': valid['sub'] }) // next flow
}