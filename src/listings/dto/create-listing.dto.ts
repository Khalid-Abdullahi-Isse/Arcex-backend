import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateListingDto {
  @IsString()
  @MinLength(4)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  district?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  sizeSqm: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;
}
