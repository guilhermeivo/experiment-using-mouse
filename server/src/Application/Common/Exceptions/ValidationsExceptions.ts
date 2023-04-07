const ValidationsException = (message: string) => ({
    error: new Error(message),
    code: 'VALIDATIONS_EXCEPTION'
})
ValidationsException.prototype = Error.prototype

export default ValidationsException