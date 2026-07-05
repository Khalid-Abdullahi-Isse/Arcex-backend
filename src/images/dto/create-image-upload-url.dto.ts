import { IsIn, IsString, MinLength } from 'class-validator';

export const ALLOWED_IMAGE_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export class CreateImageUploadUrlDto {
  @IsString()
  @MinLength(3)
  fileName: string;

  @IsIn(ALLOWED_IMAGE_CONTENT_TYPES)
  @IsString()
  contentType: string;
}
