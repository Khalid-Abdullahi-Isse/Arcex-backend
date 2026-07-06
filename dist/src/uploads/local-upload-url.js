"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_ROOT = void 0;
exports.sanitizeFileName = sanitizeFileName;
exports.createLocalUploadUrls = createLocalUploadUrls;
exports.decodeLocalUploadToken = decodeLocalUploadToken;
exports.createLocalDownloadUrl = createLocalDownloadUrl;
exports.isAllowedLocalObjectKey = isAllowedLocalObjectKey;
exports.resolveLocalObjectPath = resolveLocalObjectPath;
exports.writeLocalObject = writeLocalObject;
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const SAFE_FILE_NAME_PATTERN = /[^a-zA-Z0-9._-]/g;
exports.UPLOAD_ROOT = (0, path_1.join)(process.cwd(), 'uploads');
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
function createLocalDownloadUrl(key) {
    const token = Buffer.from(key, 'utf8').toString('base64url');
    return `/uploads/local/${token}`;
}
function isAllowedLocalObjectKey(key) {
    return (key.startsWith('listings/') || key.startsWith('sale-reports/')) && !key.includes('..');
}
function resolveLocalObjectPath(key) {
    const filePath = (0, path_1.normalize)((0, path_1.join)(exports.UPLOAD_ROOT, key));
    if (!filePath.startsWith(exports.UPLOAD_ROOT)) {
        throw new Error('Invalid upload path');
    }
    return filePath;
}
async function writeLocalObject(key, body) {
    const filePath = resolveLocalObjectPath(key);
    await (0, promises_1.mkdir)((0, path_1.dirname)(filePath), { recursive: true });
    await (0, promises_1.writeFile)(filePath, body);
}
//# sourceMappingURL=local-upload-url.js.map