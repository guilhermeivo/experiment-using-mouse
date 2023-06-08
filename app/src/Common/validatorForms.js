const MINIMUM_TIME_ERROR_MESSAGE = 5000
import validators from '@experiment-using-mouse/validators'

export default (target, config) => {
    const errorClass = config.errorClass

    const formElement = document.querySelector(config.formElement)
    if (!formElement) throw new Error(`Could not find element: ${ config.formElement }`)

    const elementTarget = formElement.querySelector(target)
    if (!elementTarget) throw new Error(`Could not find element: ${ target }`)

    const errorElement = formElement.querySelector(config.errorElement)
    if (!errorElement) throw new Error(`Could not find element: ${ config.errorElement }`)

    const isValidEmail = () => {
        const isValid = validators.isEmail(elementTarget.value)

        if (!isValid) setError('This field only accepts emails')
        return isValid
    }

    const isValidNotEmpty = () => {
        const isValid = validators.isNotEmpty(elementTarget.value)

        if (!isValid) setError('This field cannot be empty')
        return isValid
    }

    const isValidNotSpecialCharacters = () => {
        const isValid = validators.isNotSpecialCharacters(elementTarget.value)

        if (!isValid) setError('This field does not accept special characters')
        return isValid
    }

    const setError = (messageError) => {
        if (!formElement.classList.contains(errorClass)) {
            formElement.classList.add(errorClass)
            errorElement.textContent = messageError
            setTimeout(() => {
                if  (formElement.classList.contains(errorClass))
                    formElement.classList.remove(errorClass)
                errorElement.textContent = ''
            }, MINIMUM_TIME_ERROR_MESSAGE)
        } else {
            formElement.classList.remove(errorClass)
            errorElement.textContent = ''
            setError(messageError)
        }
    }

    return {
        isValidNotEmpty, isValidNotSpecialCharacters, isValidEmail
    } 
}