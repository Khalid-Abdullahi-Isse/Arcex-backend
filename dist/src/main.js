"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const express_1 = require("express");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
//# sourceMappingURL=main.js.map