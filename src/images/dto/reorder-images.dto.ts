import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';

class ReorderImageItemDto {
  @IsUUID()
  id: string;

  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderImagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderImageItemDto)
  images: ReorderImageItemDto[];
}
