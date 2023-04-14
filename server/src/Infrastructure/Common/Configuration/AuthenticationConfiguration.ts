import * as http from 'node:http'
import CookieParser from '@Infrastructure/Common/CookieParser'
import SessionService from '@Infrastructure/Services/SessionService'
import Session from "@Infrastructure/Identity/ApplicationSession"

export default async (request: http.IncomingMessage, response: http.ServerResponse<http.IncomingMessage>) => {
    const cookies = CookieParser(request.headers.cookie || '')

    if (cookies['SessionId'] && await SessionService.ValidateTokenSession(cookies['SessionId'])) { 
        if (!request.url?.includes('sessionId')) {
            const session: Session | null = await SessionService.GetTokenSession(cookies['SessionId'])

            if (session) {
                if (request.url?.includes('?')) request.url = request.url + '&sessionId=' + session.id
                else request.url = request.url + '?sessionId=' + session.id
            }
        }
    }
}