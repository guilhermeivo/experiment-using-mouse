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
require("module-alias/register");
const Server_1 = __importDefault(require("@Infrastructure/Common/Server"));
const routes_1 = __importDefault(require("@Api/routes"));
const connection_1 = require("@Infrastructure/Persistence/connection");
const _01_create_mazes_1 = __importDefault(require("@Infrastructure/Persistence/migrations/01_create_mazes"));
require('dotenv').config();
const PORT = Number(process.env.PORT) || 8000;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
Server_1.default.init();
Server_1.default.use(routes_1.default);
(0, connection_1.openConnection)().then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, _01_create_mazes_1.default)();
    Server_1.default.listen(PORT, HOSTNAME, () => {
        console.log(`Server running at ${HOSTNAME}:${PORT}/`);
    });
}));
//# sourceMappingURL=index.js.map