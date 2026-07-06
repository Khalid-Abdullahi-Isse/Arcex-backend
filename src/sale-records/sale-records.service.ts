import { Injectable, NotFoundException } from '@nestjs/common';
import { PdfService } from '../pdf/pdf.service';
import { PrismaService } from '../prisma/prisma.service';
import { createLocalDownloadUrl, writeLocalObject } from '../uploads/local-upload-url';

const publicSellerSelect = {
  id: true,
  phone: true,
  email: true,
  name: true,
  role: true,
  region: true,
  isPhoneVerified: true,
  createdAt: true,
};

@Injectable()
export class SaleRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
  ) {}

  async reportUrl(id: string) {
    const saleRecord = await this.prisma.saleRecord.findUnique({ where: { id } });
    if (!saleRecord) throw new NotFoundException('Sale record not found');
    if (!saleRecord.reportS3Key) throw new NotFoundException('report not yet generated');

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    return {
      url: createLocalDownloadUrl(saleRecord.reportS3Key),
      expiresAt: expiresAt.toISOString(),
    };
  }

  async regenerateReport(id: string) {
    const saleRecord = await this.prisma.saleRecord.findUnique({
      where: { id },
      include: { listing: { include: { seller: { select: publicSellerSelect } } } },
    });
    if (!saleRecord) throw new NotFoundException('Sale record not found');

    const buffer = await this.pdfService.generateSaleReport({
      listing: saleRecord.listing,
      saleRecord,
      seller: saleRecord.listing.seller,
    });
    const key = `sale-reports/${saleRecord.listingId}/${saleRecord.id}.pdf`;
    await writeLocalObject(key, buffer);

    const updated = await this.prisma.saleRecord.update({
      where: { id },
      data: { reportS3Key: key },
    });

    return {
      saleRecord: updated,
      report: {
        url: createLocalDownloadUrl(key),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      },
    };
  }
}
