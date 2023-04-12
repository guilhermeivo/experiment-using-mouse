import * as http from 'node:http'
import Response from "@Application/Common/Models/Response";
import CookieParser from '@Infrastructure/Common/CookieParser';
import SessionService from '@Infrastructure/Services/SessionService';

export default abstract class IdentityService {
    public static async RegisterAsync(request: http.IncomingMessage, response: http.ServerResponse<http.IncomingMessage>): Promise<Response<string>> {
        const cookies = CookieParser(request.headers.cookie || '')

        if (cookies['sessionId'] && await SessionService.ValidateTokenSession(cookies['sessionId'])) { 
            return new Response<string>('Session is already registered.', cookies['sessionId'])
        }

        const token = await SessionService.CreateTokenSession()
        response.setHeader('Set-Cookie', `sessionId=${ token }; Path=/;`)
        
        return new Response<string>('Successfully registered session', token)
    }

    public static async AuthenticateAsync(request: http.IncomingMessage, response: http.ServerResponse<http.IncomingMessage>): Promise<Response<boolean>> {
        const cookies = CookieParser(request.headers.cookie || '')

        if (!cookies['sessionId']) return new Response<boolean>('Unregistered user')
        
        const validateToken: boolean = await SessionService.ValidateTokenSession(cookies['sessionId'])

        return new Response<boolean>('Session authenticated successfully.', validateToken)
    }

    public static async RemoveAsync(request: http.IncomingMessage, response: http.ServerResponse<http.IncomingMessage>): Promise<Response<boolean>> {
        const cookies = CookieParser(request.headers.cookie || '')

        if (!cookies['sessionId']) return new Response<boolean>('Unregistered user')

        const revokeToken = await SessionService.RevokeTokenSession(cookies['sessionId'])
        
        if (revokeToken) return new Response<boolean>('Successfully removed session.', revokeToken)
        return new Response<boolean>('Unable to remove session.', revokeToken)
    }
}