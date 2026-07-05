"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFileName = sanitizeFileName;
exports.createLocalUploadUrls = createLocalUploadUrls;
exports.decodeLocalUploadToken = decodeLocalUploadToken;
const crypto_1 = require("crypto");
const SAFE_FILE_NAME_PATTERN = /[^a-zA-Z0-9._-]/g;
function sanitizeFileName(fileName) {
    const sanitized = fileName.split(/[\\/]/).pop()?.replace(SAFE_FILE_NAME_PATTERN, '-') ?? 'upload';
    return sanitized.replace(/-+/g, '-').slice(0, 120) || 'upload';
}
function createLocalUploadUrls(keyPrefix, fileName, contentType) {
    const key = `${keyPrefix}/${Date.now()}-${(0, crypto_1.randomUUID)()}-${sanitizeFileName(fileName)}`;
    const token = Buffer.from(key, 'utf8').toString('base64url');
    const url = `/api/backend/uploads/local/${token}`;
    return {
        uploadUrl: url,
        fileUrl: url,
        method: 'PUT',
        contentType,
    };
}
function decodeLocalUploadToken(token) {
    return Buffer.from(token, 'base64url').toString('utf8');
}
//# sourceMappingURL=local-upload-url.js.map