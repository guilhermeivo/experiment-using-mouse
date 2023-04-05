import TypesRequests from '@Infrastructure/Common/Enumerations/TypesRequests'

interface RoutesResponse {
    url: string,
    methods: string,
    callback: Function,
    authentication: boolean,
    queryRoute?: string,
    typeRequest?: TypesRequests
}

export default RoutesResponse