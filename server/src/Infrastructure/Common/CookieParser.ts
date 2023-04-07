import Query from "@Infrastructure/Common/Interfaces/Query"

// cookie_1=value; cookie_2=value
export default function CookieParser(cookieString: string): Query {
    if (!cookieString || cookieString == '') return { }
    
    let listCookieString: Array<string> = [ cookieString ]
    if (cookieString.includes(';')) listCookieString = cookieString.split(';')
   
    const cookies: Query = {}
    listCookieString.map((m: string) => m.split('=')).map((m: any) => {
        cookies[m[0].trim()] = m[1].trim()
    })

    return cookies
}