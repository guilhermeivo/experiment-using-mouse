export default class Validators {
    constructor()
    static isValidEmail(value: Validators.SimpleRequest): Validators.Response
    static isValidNotEmpty(value: Validators.SimpleRequest): Validators.Response
    static isValidNotSpecialCharacters(value: Validators.SimpleRequest): Validators.Response
}

declare namespace Validators {
    export type SimpleRequest = string
    export type Response = boolean
}