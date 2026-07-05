import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ReviewDocumentDto {
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}
