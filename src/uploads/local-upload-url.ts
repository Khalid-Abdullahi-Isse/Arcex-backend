import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join, normalize } from 'path';

const SAFE_FILE_NAME_PATTERN = /[^a-zA-Z0-9._-]/g;
export const UPLOAD_ROOT = join(process.cwd(), 'uploads');

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

export function createLocalDownloadUrl(key: string) {
  const token = Buffer.from(key, 'utf8').toString('base64url');
  return `/uploads/local/${token}`;
}

export function isAllowedLocalObjectKey(key: string) {
  return (key.startsWith('listings/') || key.startsWith('sale-reports/')) && !key.includes('..');
}

export function resolveLocalObjectPath(key: string) {
  const filePath = normalize(join(UPLOAD_ROOT, key));
  if (!filePath.startsWith(UPLOAD_ROOT)) {
    throw new Error('Invalid upload path');
  }
  return filePath;
}

export async function writeLocalObject(key: string, body: Buffer) {
  const filePath = resolveLocalObjectPath(key);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, body);
}
