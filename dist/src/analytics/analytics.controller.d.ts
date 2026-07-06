import { AnalyticsService } from './analytics.service';
import { DateRangeQueryDto, SalesTrendQueryDto } from './dto/analytics-query.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    salesSummary(query: DateRangeQueryDto): Promise<{
        totalSales: number;
        totalValue: number;
        avgPrice: number;
    }>;
    salesTrend(query: SalesTrendQueryDto): Promise<{
        period: string;
        count: number;
        totalValue: number;
    }[]>;
    byRegion(query: DateRangeQueryDto): Promise<{
        region: string;
        count: number;
        totalValue: number;
        avgPrice: number;
    }[]>;
    statusBreakdown(): Promise<{
        pendingReview: number;
        approved: number;
        sold: number;
        rejected: number;
    }>;
    listedVsSoldValue(query: DateRangeQueryDto): Promise<{
        totalListedValue: number;
        totalSoldValue: number;
    }>;
}
