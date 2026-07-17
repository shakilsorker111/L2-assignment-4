"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
require("dotenv/config");
const PORT = config_1.default.port;
async function main() {
    try {
        if (process.env.NODE_ENV !== "production") {
            app_1.default.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    }
    catch (error) {
        console.error("error starting the server", error);
        process.exit(1);
    }
}
main();
