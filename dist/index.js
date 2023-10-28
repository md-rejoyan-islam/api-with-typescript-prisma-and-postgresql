"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./server"));
const secret_1 = require("./secret");
// environment variables
dotenv_1.default.config();
// listen
server_1.default.listen(secret_1.PORT, () => {
    if (secret_1.NODE_ENV === "development") {
        console.log(``);
        console.log(`Server running on http://localhost:${secret_1.PORT}`);
        console.log(``);
    }
});
