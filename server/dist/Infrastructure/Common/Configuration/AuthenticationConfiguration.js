"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CookieParser_1 = __importDefault(require("@Infrastructure/Common/CookieParser"));
const SessionService_1 = __importDefault(require("@Infrastructure/Services/SessionService"));
exports.default = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const cookies = (0, CookieParser_1.default)(request.headers.cookie || '');
    if (cookies['sessionId'] && (yield SessionService_1.default.ValidateTokenSession(cookies['sessionId']))) {
        if (!((_a = request.url) === null || _a === void 0 ? void 0 : _a.includes('sessionId'))) {
            if ((_b = request.url) === null || _b === void 0 ? void 0 : _b.includes('?'))
                request.url = request.url + '&sessionId=' + cookies['sessionId'];
            else
                request.url = request.url + '?sessionId=' + cookies['sessionId'];
        }
    }
});
//# sourceMappingURL=AuthenticationConfiguration.js.map