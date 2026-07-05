"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
const app_module_1 = require("../src/app.module");
const bootstrap_1 = require("../src/bootstrap");
const server = express();
let isReady;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server), {
        bodyParser: false,
    });
    (0, bootstrap_1.configureApp)(app);
    await app.init();
}
async function handler(req, res) {
    isReady ??= bootstrap();
    await isReady;
    server(req, res);
}
//# sourceMappingURL=index.js.map