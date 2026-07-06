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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleRecordsService = void 0;
const common_1 = require("@nestjs/common");
const pdf_service_1 = require("../pdf/pdf.service");
const prisma_service_1 = require("../prisma/prisma.service");
const local_upload_url_1 = require("../uploads/local-upload-url");
const publicSellerSelect = {
    id: true,
    phone: true,
    email: true,
    name: true,
    role: true,
    region: true,
    isPhoneVerified: true,
    createdAt: true,
};
let SaleRecordsService = class SaleRecordsService {
    constructor(prisma, pdfService) {
        this.prisma = prisma;
        this.pdfService = pdfService;
    }
    async reportUrl(id) {
        const saleRecord = await this.prisma.saleRecord.findUnique({ where: { id } });
        if (!saleRecord)
            throw new common_1.NotFoundException('Sale record not found');
        if (!saleRecord.reportS3Key)
            throw new common_1.NotFoundException('report not yet generated');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        return {
            url: (0, local_upload_url_1.createLocalDownloadUrl)(saleRecord.reportS3Key),
            expiresAt: expiresAt.toISOString(),
        };
    }
    async regenerateReport(id) {
        const saleRecord = await this.prisma.saleRecord.findUnique({
            where: { id },
            include: { listing: { include: { seller: { select: publicSellerSelect } } } },
        });
        if (!saleRecord)
            throw new common_1.NotFoundException('Sale record not found');
        const buffer = await this.pdfService.generateSaleReport({
            listing: saleRecord.listing,
            saleRecord,
            seller: saleRecord.listing.seller,
        });
        const key = `sale-reports/${saleRecord.listingId}/${saleRecord.id}.pdf`;
        await (0, local_upload_url_1.writeLocalObject)(key, buffer);
        const updated = await this.prisma.saleRecord.update({
            where: { id },
            data: { reportS3Key: key },
        });
        return {
            saleRecord: updated,
            report: {
                url: (0, local_upload_url_1.createLocalDownloadUrl)(key),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            },
        };
    }
};
exports.SaleRecordsService = SaleRecordsService;
exports.SaleRecordsService = SaleRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_service_1.PdfService])
], SaleRecordsService);
//# sourceMappingURL=sale-records.service.js.map