interface urlComponents {
    path: string,
    parameters: object
}

export default (url: string): urlComponents => {
    const decodedURI = decodeURI(url)

    if (!decodedURI.includes('?')) return {
        path: decodedURI,
        parameters: { }
    }

    const queryString = decodedURI.split('?')[1] || ''
    let queryParams = [queryString]

    if (queryString.includes('&')) queryParams = queryString.split('&')

    let parameters: object = {}
    queryParams.map((m: string) => m.split('=')).map((m: Array<string>) => {
        parameters = {
            ...parameters,
            [m[0].trim()]: m[1].trim()
        }
    })
    
    return {
        path: decodedURI.split('?')[0],
        parameters
    }
}