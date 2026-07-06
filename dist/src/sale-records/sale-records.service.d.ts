import { PdfService } from '../pdf/pdf.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class SaleRecordsService {
    private readonly prisma;
    private readonly pdfService;
    constructor(prisma: PrismaService, pdfService: PdfService);
    reportUrl(id: string): Promise<{
        url: string;
        expiresAt: string;
    }>;
    regenerateReport(id: string): Promise<{
        saleRecord: {
            id: string;
            createdAt: Date;
            listingId: string;
            salePrice: import("@prisma/client/runtime/library").Decimal;
            saleDate: Date;
            paymentMethod: string;
            documentReference: string | null;
            buyerName: string;
            buyerPhone: string;
            buyerEmail: string | null;
            reportS3Key: string | null;
            updatedAt: Date;
        };
        report: {
            url: string;
            expiresAt: string;
        };
    }>;
}
