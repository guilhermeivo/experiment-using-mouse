export default class Response<T> {
    public Succeeded: boolean
    public Message: string 
    public Data?: T

    constructor(message?: string, data?: T) {
        this.Succeeded = data ? true : false
        this.Message = message || ''
        this.Data = data || undefined
    }
}