"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// cookie_1=value; cookie_2=value
function CookieParser(cookieString) {
    if (!cookieString || cookieString == '')
        return {};
    let listCookieString = [cookieString];
    if (cookieString.includes(';'))
        listCookieString = cookieString.split(';');
    const cookies = {};
    listCookieString.map((m) => m.split('=')).map((m) => {
        cookies[m[0].trim()] = m[1].trim();
    });
    return cookies;
}
exports.default = CookieParser;
//# sourceMappingURL=CookieParser.js.map