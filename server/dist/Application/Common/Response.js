"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(message, data) {
        this.Succeeded = data ? true : false;
        this.Message = message || '';
        this.Data = data || undefined;
    }
}
exports.default = Response;
//# sourceMappingURL=Response.js.map