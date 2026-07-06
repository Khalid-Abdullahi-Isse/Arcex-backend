"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const admin_module_1 = require("./admin/admin.module");
const analytics_module_1 = require("./analytics/analytics.module");
const auth_module_1 = require("./auth/auth.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const env_validation_1 = require("./config/env.validation");
const documents_module_1 = require("./documents/documents.module");
const images_module_1 = require("./images/images.module");
const listings_module_1 = require("./listings/listings.module");
const notifications_module_1 = require("./notifications/notifications.module");
const pdf_module_1 = require("./pdf/pdf.module");
const prisma_module_1 = require("./prisma/prisma.module");
const sale_records_module_1 = require("./sale-records/sale-records.module");
const users_module_1 = require("./users/users.module");
const uploads_module_1 = require("./uploads/uploads.module");
const health_controller_1 = require("./health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: env_validation_1.validateEnv,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => [
                    {
                        ttl: configService.getOrThrow('THROTTLE_TTL'),
                        limit: configService.getOrThrow('THROTTLE_LIMIT'),
                    },
                ],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            listings_module_1.ListingsModule,
            images_module_1.ImagesModule,
            documents_module_1.DocumentsModule,
            uploads_module_1.UploadsModule,
            pdf_module_1.PdfModule,
            sale_records_module_1.SaleRecordsModule,
            admin_module_1.AdminModule,
            analytics_module_1.AnalyticsModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map