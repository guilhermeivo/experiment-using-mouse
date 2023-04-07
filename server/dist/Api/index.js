"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const Server_1 = __importDefault(require("@Api/Common/Server"));
const routes_1 = __importDefault(require("@Api/routes"));
const Connection_1 = require("@Infrastructure/Persistence/Connection");
const Migrate_1 = require("@Infrastructure/Persistence/Migrate");
const AuthenticationConfiguration_1 = __importDefault(require("@Infrastructure/Common/Configuration/AuthenticationConfiguration"));
require('dotenv').config();
const PORT = Number(process.env.PORT) || 8000;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
if (process.env.NODE_ENV === 'DEVELOPMENT') {
    Server_1.default.useCors({
        origins: 'http://127.0.0.1:5500',
        headers: '*',
        methods: '*'
    });
}
else {
    Server_1.default.useCors({
        origins: 'https://guilhermeivo.github.io/experiment-using-mice',
        headers: '*',
        methods: '*'
    });
}
Server_1.default.useRouting(routes_1.default.routes);
Server_1.default.addAuthentication(AuthenticationConfiguration_1.default);
(0, Connection_1.openConnection)().then(() => {
    (0, Migrate_1.migrateAsync)();
    Server_1.default.listen(PORT, HOSTNAME);
});
//# sourceMappingURL=index.js.map