export default class Validators {
    static isValidEmail = (value) => {
        const emailRegExp = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/

        const isValid = value.length > 0 && 
            emailRegExp.test(value)

        return isValid
    }

    static isValidNotEmpty = (value) => {
        const isValid = value.length > 0

        return isValid
    }

    static isValidNotSpecialCharacters = (value) => {
        const nonAlphanumericCharactersRegExp = /(\W)|(_)/
        const numbersRegExp = /([0-9])/

        const isValid = value.length > 0 &&
            !nonAlphanumericCharactersRegExp.test(value) &&
            !numbersRegExp.test(value)

        return isValid
    }
}

Validators.version = '__VERSION__'