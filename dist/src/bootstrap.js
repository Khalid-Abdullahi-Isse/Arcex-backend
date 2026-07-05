"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = configureApp;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const express_1 = require("express");
const helmet_1 = require("helmet");
function configureApp(app) {
    const configService = app.get(config_1.ConfigService);
    const corsOrigins = configService
        .getOrThrow('CORS_ORIGIN')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.use(cookieParser());
    app.use((0, express_1.json)({ limit: '1mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '1mb' }));
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || corsOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error('CORS origin is not allowed'), false);
        },
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
}
//# sourceMappingURL=bootstrap.js.map