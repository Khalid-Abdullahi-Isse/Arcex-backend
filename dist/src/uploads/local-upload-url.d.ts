export declare const UPLOAD_ROOT: string;
export declare function sanitizeFileName(fileName: string): string;
export declare function createLocalUploadUrls(keyPrefix: string, fileName: string, contentType: string): {
    uploadUrl: string;
    fileUrl: string;
    method: string;
    contentType: string;
};
export declare function decodeLocalUploadToken(token: string): string;
export declare function createLocalDownloadUrl(key: string): string;
export declare function isAllowedLocalObjectKey(key: string): boolean;
export declare function resolveLocalObjectPath(key: string): string;
export declare function writeLocalObject(key: string, body: Buffer): Promise<void>;
