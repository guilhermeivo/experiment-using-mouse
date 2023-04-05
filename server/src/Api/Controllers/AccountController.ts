import Response from '@Application/Common/Models/Response'
import IdentityService from '@Infrastructure/Identity/IdentityService'

export default class MazeController {
    async Register(request: any, response: any): Promise<Response<string>> {
        const responseRegister = await IdentityService.RegisterAsync(request, response)

        if (responseRegister.Succeeded) {
            return responseRegister
        }
        return responseRegister
    }
}