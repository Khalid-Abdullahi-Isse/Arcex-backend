"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bootstrap_1 = require("./bootstrap");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    (0, bootstrap_1.configureApp)(app);
    const configService = app.get(config_1.ConfigService);
    await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
//# sourceMappingURL=main.js.map