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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDocumentUploadUrlDto = exports.ALLOWED_DOCUMENT_CONTENT_TYPES = void 0;
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
exports.ALLOWED_DOCUMENT_CONTENT_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
];
class CreateDocumentUploadUrlDto {
}
exports.CreateDocumentUploadUrlDto = CreateDocumentUploadUrlDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ListingDocumentType),
    __metadata("design:type", typeof (_a = typeof client_1.ListingDocumentType !== "undefined" && client_1.ListingDocumentType) === "function" ? _a : Object)
], CreateDocumentUploadUrlDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateDocumentUploadUrlDto.prototype, "fileName", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.ALLOWED_DOCUMENT_CONTENT_TYPES),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDocumentUploadUrlDto.prototype, "contentType", void 0);
//# sourceMappingURL=create-document-upload-url.dto.js.map