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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
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
let ListingsService = class ListingsService {
    constructor(prisma) {
        this.prisma = prisma;
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
            region: query.region,
            price: {
                gte: query.minPrice !== undefined ? new client_1.Prisma.Decimal(query.minPrice) : undefined,
                lte: query.maxPrice !== undefined ? new client_1.Prisma.Decimal(query.maxPrice) : undefined,
            },
            sizeSqm: {
                gte: query.minSizeSqm,
                lte: query.maxSizeSqm,
            },
        };
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
    async markSold(sellerId, id) {
        await this.assertSellerOwnsListing(sellerId, id);
        return this.prisma.listing.update({
            where: { id },
            data: { status: client_1.ListingStatus.SOLD },
        });
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
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map