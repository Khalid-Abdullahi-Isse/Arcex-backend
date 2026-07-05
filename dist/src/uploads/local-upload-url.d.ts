export declare function sanitizeFileName(fileName: string): string;
export declare function createLocalUploadUrls(keyPrefix: string, fileName: string, contentType: string): {
    uploadUrl: string;
    fileUrl: string;
    method: string;
    contentType: string;
};
export declare function decodeLocalUploadToken(token: string): string;
