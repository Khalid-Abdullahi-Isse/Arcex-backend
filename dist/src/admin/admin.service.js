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
exports.AdminService = void 0;
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
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    pendingListings() {
        return this.prisma.listing.findMany({
            where: { status: client_1.ListingStatus.PENDING_REVIEW },
            include: { seller: { select: publicSellerSelect }, images: { orderBy: { order: 'asc' } }, documents: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    approveListing(id) {
        return this.prisma.listing.update({
            where: { id },
            data: { status: client_1.ListingStatus.APPROVED, rejectionNote: null },
        });
    }
    rejectListing(id, dto) {
        return this.prisma.listing.update({
            where: { id },
            data: {
                status: client_1.ListingStatus.REJECTED,
                rejectionNote: dto.rejectionNote ?? 'Rejected by admin review',
            },
        });
    }
    pendingDocuments() {
        return this.prisma.listingDocument.findMany({
            where: { reviewedAt: null },
            include: { listing: { include: { seller: { select: publicSellerSelect } } } },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map