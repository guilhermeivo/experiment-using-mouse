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
const Response_1 = __importDefault(require("@Application/Common/Models/Response"));
const CookieParser_1 = __importDefault(require("@Infrastructure/Common/CookieParser"));
const SessionService_1 = __importDefault(require("@Infrastructure/Services/SessionService"));
class IdentityService {
    static RegisterAsync(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = (0, CookieParser_1.default)(request.headers.cookie || '');
            if (cookies['sessionId'] && (yield SessionService_1.default.ValidateTokenSession(cookies['sessionId']))) {
                return new Response_1.default('User is already registered.', cookies['sessionId']);
            }
            const token = yield SessionService_1.default.CreateTokenSession();
            response.setHeader('Set-Cookie', `sessionId=${token}; Path=/`);
            return new Response_1.default('Successfully registered user', token);
        });
    }
    static AuthenticateAsync(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = (0, CookieParser_1.default)(request.headers.cookie || '');
            if (!cookies['sessionId'])
                return new Response_1.default('Unregistered user');
            const validateToken = yield SessionService_1.default.ValidateTokenSession(cookies['sessionId']);
            return new Response_1.default('User authenticated successfully.', validateToken);
        });
    }
}
exports.default = IdentityService;
//# sourceMappingURL=IdentityService.js.map