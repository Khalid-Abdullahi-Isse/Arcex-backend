import { Module } from '@nestjs/common';
import { PdfModule } from '../pdf/pdf.module';
import { SaleRecordsController } from './sale-records.controller';
import { SaleRecordsService } from './sale-records.service';

@Module({
  imports: [PdfModule],
  controllers: [SaleRecordsController],
  providers: [SaleRecordsService],
})
export class SaleRecordsModule {}
