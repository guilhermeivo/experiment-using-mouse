import * as http from 'node:http'
import Result from '../models/Result'

export default interface controllerProps {
    [key: string]: GenericFunction | string
    method: string
}

type GenericFunction = (request?: any, response?: http.ServerResponse) => Result<any> | Promise<Result<any>>