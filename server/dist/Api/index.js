"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const Server_1 = __importDefault(require("@Infrastructure/Common/Server"));
const routes_1 = __importDefault(require("@Api/routes"));
require('dotenv').config();
const PORT = Number(process.env.PORT) || 8000;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
Server_1.default.init();
Server_1.default.use(routes_1.default);
Server_1.default.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
//# sourceMappingURL=index.js.map