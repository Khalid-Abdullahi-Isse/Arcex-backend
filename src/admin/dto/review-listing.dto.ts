import { IsOptional, IsString } from 'class-validator';

export class ReviewListingDto {
  @IsOptional()
  @IsString()
  rejectionNote?: string;
}
