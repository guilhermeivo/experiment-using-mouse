"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const Server_1 = __importDefault(require("@Infrastructure/Common/Server"));
const routes_1 = __importDefault(require("@Api/routes"));
const connection_1 = require("@Infrastructure/Persistence/connection");
require('dotenv').config();
const PORT = Number(process.env.PORT) || 8000;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
Server_1.default.init();
Server_1.default.use(routes_1.default);
(0, connection_1.openConnection)();
Server_1.default.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at ${HOSTNAME}:${PORT}/`);
});
//# sourceMappingURL=index.js.map