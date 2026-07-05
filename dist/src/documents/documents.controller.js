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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../auth/guards/admin.guard");
const add_listing_document_dto_1 = require("./dto/add-listing-document.dto");
const create_document_upload_url_dto_1 = require("./dto/create-document-upload-url.dto");
const review_document_dto_1 = require("./dto/review-document.dto");
const documents_service_1 = require("./documents.service");
let DocumentsController = class DocumentsController {
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    createUploadUrl(request, listingId, dto) {
        return this.documentsService.createUploadUrl(request.user.sub, listingId, dto);
    }
    addDocument(request, listingId, dto) {
        return this.documentsService.addDocument(request.user.sub, listingId, dto);
    }
    review(request, documentId, dto) {
        return this.documentsService.review(documentId, request.user.phone, dto);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)('listings/:listingId/documents/upload-url'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('listingId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_document_upload_url_dto_1.CreateDocumentUploadUrlDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "createUploadUrl", null);
__decorate([
    (0, common_1.Post)('listings/:listingId/documents'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('listingId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_listing_document_dto_1.AddListingDocumentDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "addDocument", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)('admin/documents/:documentId/review'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('documentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, review_document_dto_1.ReviewDocumentDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "review", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map