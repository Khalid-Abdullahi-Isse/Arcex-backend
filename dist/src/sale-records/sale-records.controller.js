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
exports.SaleRecordsController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../auth/guards/admin.guard");
const sale_records_service_1 = require("./sale-records.service");
let SaleRecordsController = class SaleRecordsController {
    constructor(saleRecordsService) {
        this.saleRecordsService = saleRecordsService;
    }
    reportUrl(id) {
        return this.saleRecordsService.reportUrl(id);
    }
    regenerateReport(id) {
        return this.saleRecordsService.regenerateReport(id);
    }
};
exports.SaleRecordsController = SaleRecordsController;
__decorate([
    (0, common_1.Get)(':id/report'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SaleRecordsController.prototype, "reportUrl", null);
__decorate([
    (0, common_1.Post)(':id/report/regenerate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SaleRecordsController.prototype, "regenerateReport", null);
exports.SaleRecordsController = SaleRecordsController = __decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Controller)('sale-records'),
    __metadata("design:paramtypes", [sale_records_service_1.SaleRecordsService])
], SaleRecordsController);
//# sourceMappingURL=sale-records.controller.js.map