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
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const local_upload_url_1 = require("../uploads/local-upload-url");
let ImagesService = class ImagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUploadUrl(userId, listingId, dto) {
        await this.assertSellerOwnsListing(userId, listingId);
        return (0, local_upload_url_1.createLocalUploadUrls)(`listings/${listingId}/photos`, dto.fileName, dto.contentType);
    }
    async addImage(userId, listingId, dto) {
        await this.assertSellerOwnsListing(userId, listingId);
        return this.prisma.listingImage.create({ data: { ...dto, listingId } });
    }
    async reorder(userId, listingId, dto) {
        await this.assertSellerOwnsListing(userId, listingId);
        await this.prisma.$transaction(dto.images.map((image) => this.prisma.listingImage.update({
            where: { id: image.id },
            data: { order: image.order },
        })));
        return this.prisma.listingImage.findMany({ where: { listingId }, orderBy: { order: 'asc' } });
    }
    async remove(userId, listingId, imageId) {
        await this.assertSellerOwnsListing(userId, listingId);
        return this.prisma.listingImage.delete({ where: { id: imageId } });
    }
    async assertSellerOwnsListing(userId, listingId) {
        const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        if (listing.sellerId !== userId)
            throw new common_1.ForbiddenException('Seller access required');
    }
};
exports.ImagesService = ImagesService;
exports.ImagesService = ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImagesService);
//# sourceMappingURL=images.service.js.map