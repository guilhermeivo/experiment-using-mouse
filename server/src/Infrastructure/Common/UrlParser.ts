import Query from '@Infrastructure/Common/Interfaces/Query'

interface urlComponents {
    path: string,
    queries: Query
}

export default function UrlParser(url: string): urlComponents {
    const decodedURI = decodeURI(url)

    if (decodedURI.includes('?')) {
        let queryString = decodedURI.split('?')[1] || ''
        let queryParams

        if (queryString.includes('&')) queryParams = queryString.split('&')
        else queryParams = [queryString]

        const queries: Query = {}
        queryParams.map((m: string) => m.split('=')).map((m: any) => {
            queries[m[0].trim()] = m[1].trim()
        })
        
        return {
            path: decodedURI.split('?')[0],
            queries: queries
        }
    } else {        
        return {
            path: decodedURI,
            queries: {}
        }
    }
}