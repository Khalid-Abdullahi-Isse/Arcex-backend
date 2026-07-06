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
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const create_listing_dto_1 = require("./dto/create-listing.dto");
const mark_listing_sold_dto_1 = require("./dto/mark-listing-sold.dto");
const search_listings_dto_1 = require("./dto/search-listings.dto");
const update_listing_dto_1 = require("./dto/update-listing.dto");
const listings_service_1 = require("./listings.service");
let ListingsController = class ListingsController {
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    create(request, dto) {
        return this.listingsService.create(request.user.sub, dto);
    }
    search(query) {
        return this.listingsService.search(query);
    }
    findOne(id) {
        return this.listingsService.findOne(id);
    }
    async infoSheet(id, response) {
        const { buffer, filename } = await this.listingsService.generateInfoSheet(id);
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Length', buffer.length);
        response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        response.send(buffer);
    }
    update(request, id, dto) {
        return this.listingsService.update(request.user.sub, id, dto);
    }
    markSold(request, id, dto) {
        return this.listingsService.markSold(request.user.sub, id, dto);
    }
    remove(request, id) {
        return this.listingsService.remove(request.user.sub, id);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_listing_dto_1.CreateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_listings_dto_1.SearchListingsDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "search", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/info-sheet'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "infoSheet", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_listing_dto_1.UpdateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/sold'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, mark_listing_sold_dto_1.MarkListingSoldDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "markSold", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "remove", null);
exports.ListingsController = ListingsController = __decorate([
    (0, common_1.Controller)('listings'),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsController);
//# sourceMappingURL=listings.controller.js.map