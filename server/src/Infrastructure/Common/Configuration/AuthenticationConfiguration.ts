import * as http from 'node:http'
import CookieParser from '@Infrastructure/Common/CookieParser'
import SessionService from '@Infrastructure/Services/SessionService'

export default async (request: http.IncomingMessage, response: http.ServerResponse<http.IncomingMessage>) => {
    const cookies = CookieParser(request.headers.cookie || '')

    if (cookies['sessionId'] && await SessionService.ValidateTokenSession(cookies['sessionId'])) { 
        if (!request.url?.includes('sessionId')) {
            if (request.url?.includes('?')) request.url = request.url + '&sessionId=' + cookies['sessionId']
            else request.url = request.url + '?sessionId=' + cookies['sessionId']
        }
    }
}