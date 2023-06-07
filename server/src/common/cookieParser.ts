// cookie_1=value; cookie_2=value
export default function cookieParser(cookieString: string) {
    if (!cookieString || cookieString == '') return { }
    
    let listCookieString: Array<string> = [ cookieString ]
    if (cookieString.includes(';')) listCookieString = cookieString.split(';')
   
    let cookies = {}
    listCookieString.map((m: string) => m.split('=')).map((m: Array<string>) => {
        cookies = {
            ...cookies,
            [m[0].trim()]: m[1].trim()
        }
    })

    return cookies
}