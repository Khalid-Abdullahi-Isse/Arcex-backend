import { IsIn, IsISO8601, IsOptional } from 'class-validator';

export class DateRangeQueryDto {
  @IsOptional()
  @IsISO8601({ strict: true })
  from?: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  to?: string;
}

export class SalesTrendQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsIn(['day', 'week', 'month'])
  granularity?: 'day' | 'week' | 'month';
}
