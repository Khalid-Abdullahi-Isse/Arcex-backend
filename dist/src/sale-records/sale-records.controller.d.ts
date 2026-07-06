import { SaleRecordsService } from './sale-records.service';
export declare class SaleRecordsController {
    private readonly saleRecordsService;
    constructor(saleRecordsService: SaleRecordsService);
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
