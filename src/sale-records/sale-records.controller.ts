import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { SaleRecordsService } from './sale-records.service';

@UseGuards(AdminGuard)
@Controller('sale-records')
export class SaleRecordsController {
  constructor(private readonly saleRecordsService: SaleRecordsService) {}

  @Get(':id/report')
  reportUrl(@Param('id') id: string) {
    return this.saleRecordsService.reportUrl(id);
  }

  @Post(':id/report/regenerate')
  regenerateReport(@Param('id') id: string) {
    return this.saleRecordsService.regenerateReport(id);
  }
}
