import type { Request, Response } from 'express';
export declare class UploadsController {
    upload(token: string, request: Request, response: Response): Promise<void>;
    download(token: string, response: Response): void;
    private decodeSafeKey;
    private resolveUploadPath;
    private readRequestBody;
}
