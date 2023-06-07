import * as http from 'node:http'
import Result from '../models/Result'

export default interface IControllerProps {
    [key: string]: GenericFunction | string
    method: string
}

type GenericFunction = (request?: any, response?: http.ServerResponse) => Result<object> | Promise<Result<object | number | string>>