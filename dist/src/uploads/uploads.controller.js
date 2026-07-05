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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const local_upload_url_1 = require("./local-upload-url");
const UPLOAD_ROOT = (0, path_1.join)(process.cwd(), 'uploads');
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
let UploadsController = class UploadsController {
    async upload(token, request, response) {
        const key = this.decodeSafeKey(token);
        const chunks = [];
        let totalBytes = 0;
        for await (const chunk of request) {
            const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            totalBytes += buffer.length;
            if (totalBytes > MAX_UPLOAD_BYTES) {
                throw new common_1.BadRequestException('File exceeds the 10MB upload limit');
            }
            chunks.push(buffer);
        }
        const filePath = this.resolveUploadPath(key);
        await (0, promises_1.mkdir)((0, path_1.dirname)(filePath), { recursive: true });
        await (0, promises_1.writeFile)(filePath, Buffer.concat(chunks));
        response.status(204).send();
    }
    download(token, response) {
        const key = this.decodeSafeKey(token);
        const filePath = this.resolveUploadPath(key);
        if (!(0, fs_1.existsSync)(filePath)) {
            response.status(404).send();
            return;
        }
        (0, fs_1.createReadStream)(filePath).pipe(response);
    }
    decodeSafeKey(token) {
        const key = (0, local_upload_url_1.decodeLocalUploadToken)(token);
        if (!key.startsWith('listings/') || key.includes('..')) {
            throw new common_1.BadRequestException('Invalid upload token');
        }
        return key;
    }
    resolveUploadPath(key) {
        const filePath = (0, path_1.normalize)((0, path_1.join)(UPLOAD_ROOT, key));
        if (!filePath.startsWith(UPLOAD_ROOT)) {
            throw new common_1.BadRequestException('Invalid upload path');
        }
        return filePath;
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "upload", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "download", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads/local')
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map