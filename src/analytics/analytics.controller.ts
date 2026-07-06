import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AnalyticsService } from './analytics.service';
import { DateRangeQueryDto, SalesTrendQueryDto } from './dto/analytics-query.dto';

@UseGuards(AdminGuard)
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales-summary')
  salesSummary(@Query() query: DateRangeQueryDto) {
    return this.analyticsService.salesSummary(query);
  }

  @Get('sales-trend')
  salesTrend(@Query() query: SalesTrendQueryDto) {
    return this.analyticsService.salesTrend(query);
  }

  @Get('by-region')
  byRegion(@Query() query: DateRangeQueryDto) {
    return this.analyticsService.byRegion(query);
  }

  @Get('status-breakdown')
  statusBreakdown() {
    return this.analyticsService.statusBreakdown();
  }

  @Get('listed-vs-sold-value')
  listedVsSoldValue(@Query() query: DateRangeQueryDto) {
    return this.analyticsService.listedVsSoldValue(query);
  }
}
