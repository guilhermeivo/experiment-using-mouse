import TypesRequests from '@Api/Common/Enumerations/TypesRequests'

interface RoutesResponse {
    url: string,
    methods: string,
    callback: Function,
    queryRoute?: string,
    typeRequest?: TypesRequests
}

export default RoutesResponse