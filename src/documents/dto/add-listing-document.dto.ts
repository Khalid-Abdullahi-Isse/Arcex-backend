import { ListingDocumentType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class AddListingDocumentDto {
  @IsEnum(ListingDocumentType)
  type: ListingDocumentType;

  @IsString()
  fileUrl: string;
}
