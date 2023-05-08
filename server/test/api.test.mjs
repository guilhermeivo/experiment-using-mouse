// https://nodejs.org/api/test.html
import { describe, before, after, it } from 'node:test'
import { deepEqual, deepStrictEqual, ok } from 'node:assert'
import * as dotenv from 'dotenv'
dotenv.config()

const BASE_URL = process.env.BASE_URL
const accessToken = 'ACCESS_TOKEN'

describe('api server test - auth', () => {  
    async function makePost(url, data) {
        const request = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        return request.json()
    }

    async function makeGet(url) {
        const request = await fetch(url, {
            method: 'GET',
        })
        return request.json()
    }

    it('it should create simple account', async () => {
        const input = {
            username: 'simple username',
            email: 'simple@test.com',
            redirectUri: 'redirectUri'
        }
        const result = await makePost(`${ BASE_URL }/auth/register`, input)
        console.table(result)
        ok(result.Succeeded)
    })

    it('it should verify simple account email', async () => {
        const input = {
            userId: 'ID',
            emailToken: 'TOKEN',
            redirectUri: 'redirectUri'
        }
        const result = await makeGet(`${ BASE_URL }/auth/verify-email?userId=${ input.userId }&emailToken=${ input.emailToken }&redirectUri=${ input.redirectUri }`)
        console.table(result)
        ok(result.Succeeded)
    })

    it('it should login in simple account', async () => {
        const input = {
            email: 'simple@test.com'
        }
        const result = await makePost(`${ BASE_URL }/auth/login`, input)
        console.table(result)
        ok(result.Succeeded)
    })

    it('it should authenticate the simple account', async () => {
        const input = {
            email: 'simple@test.com',
            token: 'TOKEN'
        }
        const result = await makePost(`${ BASE_URL }/auth/authenticate`, input)
        console.table(result)
        ok(result.Succeeded)
    })

    after(() => console.log('finished running tests'))
})

describe('api server test - maze', () => {  
    let _globalToken

    async function makePost(url, data) {
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                cookie: _globalToken
            },
            body: JSON.stringify(data)
        })
        return request.json()
    }
    
    async function makeGet(url) {
        const request = await fetch(url, {
            method: 'GET',
            headers: {
                cookie: _globalToken
            }
        })
        return request.json()
    }

    async function setToken() {
        _globalToken = `access_token=${ accessToken }`
    }

    before(async () => setToken())

    it('it should get all mazes', async () => {
        const result = await makeGet(`${ BASE_URL }/maze`)
        console.table(result.Message)
        ok(result.Succeeded, 'get all should be realized')
    })

    it('it should get maze by user', async () => {
        const result = await makeGet(`${ BASE_URL }/maze/user`)
        console.table({ Message: result.Message })
        ok(result.Succeeded, 'get by user should be realized')
    })

    let _idMazeCreated

    it('it should create simple maze', async () => {
        const input = {
            name: 'maze',
            description: 'simple maze',
            image: 'base64image'
        }
        const result = await makePost(`${ BASE_URL }/maze`, input)
        _idMazeCreated = result.Data
        console.table({ Message: result.Message })
        ok(result.Succeeded, 'create should be realized')
    })

    it('it should toggle like maze', async () => {
        const input = {
            id: _idMazeCreated
        }
        const result = await makePost(`${ BASE_URL }/maze/like`, input)
        console.table(result)
        ok(result.Succeeded, 'toggle like should be realized')
    })

    it('it should add view in maze', async () => {
        const input = {
            id: _idMazeCreated
        }
        const result = await makePost(`${ BASE_URL }/maze/view`, input)
        console.table(result)
        ok(result.Succeeded, 'add view should be realized')
    })

    it('it should get maze by id', async () => {
        const input = {
            id: _idMazeCreated
        }
        const result = await makeGet(`${ BASE_URL }/maze/id?id=${ input.id }`)
        console.table(result)
        ok(result.Succeeded, 'get by id should be realized')
    })

    it('it should update maze', async () => {
        const input = {
            id: _idMazeCreated,
            name: 'update maze',
            description: 'update simple maze',
            image: 'base64image'
        }
        const result = await makePost(`${ BASE_URL }/maze/update`, input)
        console.table(result)
        ok(result.Succeeded, 'update should be realized')
    })

    after(() => console.log('finished running tests'))
})