import { ListingDocumentType } from '@prisma/client';
import { IsEnum, IsIn, IsString, MinLength } from 'class-validator';

export const ALLOWED_DOCUMENT_CONTENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export class CreateDocumentUploadUrlDto {
  @IsEnum(ListingDocumentType)
  type: ListingDocumentType;

  @IsString()
  @MinLength(3)
  fileName: string;

  @IsIn(ALLOWED_DOCUMENT_CONTENT_TYPES)
  @IsString()
  contentType: string;
}
