import { IsInt, IsString, Min } from 'class-validator';

export class AddListingImageDto {
  @IsString()
  url: string;

  @IsInt()
  @Min(0)
  order: number;
}
