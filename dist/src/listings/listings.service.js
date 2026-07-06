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
var ListingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
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
let ListingsService = ListingsService_1 = class ListingsService {
    constructor(prisma, pdfService) {
        this.prisma = prisma;
        this.pdfService = pdfService;
        this.logger = new common_1.Logger(ListingsService_1.name);
    }
    create(sellerId, dto) {
        return this.prisma.listing.create({
            data: {
                ...dto,
                sellerId,
                price: new client_1.Prisma.Decimal(dto.price),
            },
            include: { images: { orderBy: { order: 'asc' } }, documents: true },
        });
    }
    async search(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = {
            status: client_1.ListingStatus.APPROVED,
        };
        if (query.region) {
            where.region = query.region;
        }
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            where.price = {
                gte: query.minPrice !== undefined ? new client_1.Prisma.Decimal(query.minPrice) : undefined,
                lte: query.maxPrice !== undefined ? new client_1.Prisma.Decimal(query.maxPrice) : undefined,
            };
        }
        if (query.minSizeSqm !== undefined || query.maxSizeSqm !== undefined) {
            where.sizeSqm = {
                gte: query.minSizeSqm,
                lte: query.maxSizeSqm,
            };
        }
        const [items, total] = await Promise.all([
            this.prisma.listing.findMany({
                where,
                include: { images: { orderBy: { order: 'asc' } }, seller: { select: publicSellerSelect } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.listing.count({ where }),
        ]);
        return { items, total, page, limit };
    }
    async findOne(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                images: { orderBy: { order: 'asc' } },
                documents: true,
                seller: { select: publicSellerSelect },
            },
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return listing;
    }
    async generateInfoSheet(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                images: { orderBy: { order: 'asc' } },
                seller: { select: publicSellerSelect },
            },
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        if (listing.status !== client_1.ListingStatus.APPROVED && listing.status !== client_1.ListingStatus.SOLD) {
            throw new common_1.BadRequestException('Only approved or sold listings can be exported as info sheets');
        }
        const buffer = await this.pdfService.generateListingInfoSheet({
            listing,
            images: listing.images,
            seller: listing.seller,
        });
        return {
            buffer,
            filename: `acrex-land-${listing.id}-${this.slugify(listing.title)}.pdf`,
        };
    }
    async update(sellerId, id, dto) {
        await this.assertSellerOwnsListing(sellerId, id);
        return this.prisma.listing.update({
            where: { id },
            data: {
                ...dto,
                price: dto.price !== undefined ? new client_1.Prisma.Decimal(dto.price) : undefined,
                status: client_1.ListingStatus.PENDING_REVIEW,
                rejectionNote: null,
            },
            include: { images: { orderBy: { order: 'asc' } }, documents: true },
        });
    }
    async markSold(sellerId, id, dto) {
        await this.assertSellerOwnsListing(sellerId, id);
        return this.recordSale(id, dto);
    }
    async markSoldByAdmin(id, dto) {
        return this.recordSale(id, dto);
    }
    async remove(sellerId, id) {
        await this.assertSellerOwnsListing(sellerId, id);
        return this.prisma.listing.delete({ where: { id } });
    }
    async assertSellerOwnsListing(sellerId, id) {
        const listing = await this.prisma.listing.findUnique({ where: { id } });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        if (listing.sellerId !== sellerId)
            throw new common_1.ForbiddenException('Seller access required');
    }
    async recordSale(id, dto) {
        const result = await this.prisma.$transaction(async (tx) => {
            const listing = await tx.listing.update({
                where: { id },
                data: { status: client_1.ListingStatus.SOLD },
                include: {
                    seller: { select: publicSellerSelect },
                    images: { orderBy: { order: 'asc' } },
                    documents: true,
                },
            });
            const saleRecord = await tx.saleRecord.create({
                data: {
                    listingId: id,
                    salePrice: new client_1.Prisma.Decimal(dto.salePrice),
                    saleDate: new Date(dto.saleDate),
                    paymentMethod: dto.paymentMethod,
                    documentReference: dto.documentReference,
                    buyerName: dto.buyerName,
                    buyerPhone: dto.buyerPhone,
                    buyerEmail: dto.buyerEmail?.toLowerCase(),
                },
            });
            return { listing, saleRecord };
        });
        let saleRecord = result.saleRecord;
        try {
            const buffer = await this.pdfService.generateSaleReport({
                listing: result.listing,
                saleRecord,
                seller: result.listing.seller,
            });
            const key = `sale-reports/${id}/${saleRecord.id}.pdf`;
            await (0, local_upload_url_1.writeLocalObject)(key, buffer);
            saleRecord = await this.prisma.saleRecord.update({
                where: { id: saleRecord.id },
                data: { reportS3Key: key },
            });
        }
        catch (error) {
            this.logger.error(`Failed to generate sale report for listing ${id}`, error);
        }
        return {
            listing: result.listing,
            saleRecord: {
                ...saleRecord,
                reportUrl: saleRecord.reportS3Key ? (0, local_upload_url_1.createLocalDownloadUrl)(saleRecord.reportS3Key) : null,
            },
        };
    }
    slugify(value) {
        return (value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 60) || 'listing');
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = ListingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_service_1.PdfService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map