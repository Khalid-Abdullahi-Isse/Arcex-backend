import { ConfigService } from '@nestjs/config';
import { Listing, ListingImage, SaleRecord } from '@prisma/client';
type SellerForReport = {
    name: string;
    phone: string;
    email?: string | null;
};
type SellerForInfoSheet = {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    region: string | null;
    role: string;
    isPhoneVerified: boolean;
    createdAt: Date;
};
export declare class PdfService {
    private readonly configService;
    private logoBuffer?;
    private iconBuffer?;
    constructor(configService: ConfigService);
    generateSaleReport(params: {
        listing: Listing;
        saleRecord: SaleRecord;
        seller: SellerForReport;
    }): Promise<Buffer>;
    generateListingInfoSheet(params: {
        listing: Listing;
        images: ListingImage[];
        seller: SellerForInfoSheet;
    }): Promise<Buffer>;
    private drawInfoSheetPageOne;
    private drawPhotoGrid;
    private drawImagePlaceholder;
    private drawDetailsTable;
    private drawSellerAndFooter;
    private sectionHeader;
    private compactRow;
    private bullet;
    private sectionTitle;
    private row;
    private rule;
    private formatMoney;
    private formatNumber;
    private formatDate;
    private formatDateTime;
    private formatMonthYear;
    private formatPricePerSqm;
    private locationLabel;
    private valueOrDash;
    private buildListingUrl;
    private loadListingImages;
    private loadImageBuffer;
    private localUploadPathFromUrl;
    private getLogoBuffer;
    private getIconBuffer;
    private rasterizeSvg;
}
export {};
