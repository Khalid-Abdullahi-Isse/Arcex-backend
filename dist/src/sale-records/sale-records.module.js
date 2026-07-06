"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleRecordsModule = void 0;
const common_1 = require("@nestjs/common");
const pdf_module_1 = require("../pdf/pdf.module");
const sale_records_controller_1 = require("./sale-records.controller");
const sale_records_service_1 = require("./sale-records.service");
let SaleRecordsModule = class SaleRecordsModule {
};
exports.SaleRecordsModule = SaleRecordsModule;
exports.SaleRecordsModule = SaleRecordsModule = __decorate([
    (0, common_1.Module)({
        imports: [pdf_module_1.PdfModule],
        controllers: [sale_records_controller_1.SaleRecordsController],
        providers: [sale_records_service_1.SaleRecordsService],
    })
], SaleRecordsModule);
//# sourceMappingURL=sale-records.module.js.map