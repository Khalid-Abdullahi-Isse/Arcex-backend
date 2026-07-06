"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../auth/guards/admin.guard");
const analytics_service_1 = require("./analytics.service");
const analytics_query_dto_1 = require("./dto/analytics-query.dto");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    salesSummary(query) {
        return this.analyticsService.salesSummary(query);
    }
    salesTrend(query) {
        return this.analyticsService.salesTrend(query);
    }
    byRegion(query) {
        return this.analyticsService.byRegion(query);
    }
    statusBreakdown() {
        return this.analyticsService.statusBreakdown();
    }
    listedVsSoldValue(query) {
        return this.analyticsService.listedVsSoldValue(query);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('sales-summary'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "salesSummary", null);
__decorate([
    (0, common_1.Get)('sales-trend'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.SalesTrendQueryDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "salesTrend", null);
__decorate([
    (0, common_1.Get)('by-region'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "byRegion", null);
__decorate([
    (0, common_1.Get)('status-breakdown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "statusBreakdown", null);
__decorate([
    (0, common_1.Get)('listed-vs-sold-value'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "listedVsSoldValue", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Controller)('admin/analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map