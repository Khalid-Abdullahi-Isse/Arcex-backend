import { randomUUID } from 'crypto';

const SAFE_FILE_NAME_PATTERN = /[^a-zA-Z0-9._-]/g;

export function sanitizeFileName(fileName: string) {
  const sanitized = fileName.split(/[\\/]/).pop()?.replace(SAFE_FILE_NAME_PATTERN, '-') ?? 'upload';
  return sanitized.replace(/-+/g, '-').slice(0, 120) || 'upload';
}

export function createLocalUploadUrls(keyPrefix: string, fileName: string, contentType: string) {
  const key = `${keyPrefix}/${Date.now()}-${randomUUID()}-${sanitizeFileName(fileName)}`;
  const token = Buffer.from(key, 'utf8').toString('base64url');
  const url = `/api/backend/uploads/local/${token}`;

  return {
    uploadUrl: url,
    fileUrl: url,
    method: 'PUT',
    contentType,
  };
}

export function decodeLocalUploadToken(token: string) {
  return Buffer.from(token, 'base64url').toString('utf8');
}
