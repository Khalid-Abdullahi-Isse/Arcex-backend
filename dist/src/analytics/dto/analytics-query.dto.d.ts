export declare class DateRangeQueryDto {
    from?: string;
    to?: string;
}
export declare class SalesTrendQueryDto extends DateRangeQueryDto {
    granularity?: 'day' | 'week' | 'month';
}
