"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationsException = (message) => ({
    error: new Error(message),
    code: 'VALIDATIONS_EXCEPTION'
});
ValidationsException.prototype = Error.prototype;
exports.default = ValidationsException;
//# sourceMappingURL=ValidationsExceptions.js.map