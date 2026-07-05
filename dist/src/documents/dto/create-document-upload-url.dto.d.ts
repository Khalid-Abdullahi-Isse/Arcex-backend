import { ListingDocumentType } from '@prisma/client';
export declare const ALLOWED_DOCUMENT_CONTENT_TYPES: readonly ["application/pdf", "image/jpeg", "image/png", "image/webp"];
export declare class CreateDocumentUploadUrlDto {
    type: ListingDocumentType;
    fileName: string;
    contentType: string;
}
