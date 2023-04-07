"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function UrlParser(url) {
    const decodedURI = decodeURI(url);
    if (decodedURI.includes('?')) {
        let queryString = decodedURI.split('?')[1] || '';
        let queryParams;
        if (queryString.includes('&'))
            queryParams = queryString.split('&');
        else
            queryParams = [queryString];
        const queries = {};
        queryParams.map((m) => m.split('=')).map((m) => {
            queries[m[0].trim()] = m[1].trim();
        });
        return {
            path: decodedURI.split('?')[0],
            queries: queries
        };
    }
    else {
        return {
            path: decodedURI,
            queries: {}
        };
    }
}
exports.default = UrlParser;
//# sourceMappingURL=UrlParser.js.map