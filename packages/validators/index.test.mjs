// https://nodejs.org/api/test.html
import { describe, before, after, it } from 'node:test'
import { deepEqual, deepStrictEqual, ok } from 'node:assert'

import validators from './index.js'

describe('package validators', () => {
    it('it should is valid email', async () => {
        const email = 'test@test.test'
        const result = validators.isEmail(email)

        deepStrictEqual(result, true)
    })

    it('it should is not valid email', async () => {
        const email = 'test'
        const result = validators.isEmail(email)

        deepStrictEqual(result, false)
    })

    it('it should is not empty', async () => {
        const value = 'test'
        const result = validators.isNotEmpty(value)

        deepStrictEqual(result, true)
    })

    it('it should is empty', async () => {
        const value = ''
        const result = validators.isNotEmpty(value)

        deepStrictEqual(result, false)
    })

    it('it should is not special characters', async () => {
        const value = 'test'
        const result = validators.isNotSpecialCharacters(value)

        deepStrictEqual(result, true)
    })

    it('it should is special characters', async () => {
        const value = '@'
        const result = validators.isNotSpecialCharacters(value)

        deepStrictEqual(result, false)
    })


    after(() => console.log('finished running tests'))
})