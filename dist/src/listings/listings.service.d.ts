import { Prisma } from '@prisma/client';
import { PdfService } from '../pdf/pdf.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { MarkListingSoldDto } from './dto/mark-listing-sold.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
export declare class ListingsService {
    private readonly prisma;
    private readonly pdfService;
    private readonly logger;
    constructor(prisma: PrismaService, pdfService: PdfService);
    create(sellerId: string, dto: CreateListingDto): Prisma.Prisma__ListingClient<{
        images: {
            id: string;
            listingId: string;
            url: string;
            order: number;
        }[];
        documents: {
            id: string;
            listingId: string;
            type: import(".prisma/client").$Enums.ListingDocumentType;
            fileUrl: string;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        }[];
    } & {
        id: string;
        sellerId: string;
        title: string;
        description: string;
        region: string;
        district: string | null;
        sizeSqm: number;
        price: Prisma.Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    search(query: SearchListingsDto): Promise<{
        items: ({
            seller: {
                name: string;
                id: string;
                region: string | null;
                createdAt: Date;
                phone: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                isPhoneVerified: boolean;
            };
            images: {
                id: string;
                listingId: string;
                url: string;
                order: number;
            }[];
        } & {
            id: string;
            sellerId: string;
            title: string;
            description: string;
            region: string;
            district: string | null;
            sizeSqm: number;
            price: Prisma.Decimal;
            currency: string;
            latitude: number | null;
            longitude: number | null;
            status: import(".prisma/client").$Enums.ListingStatus;
            rejectionNote: string | null;
            createdAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        seller: {
            name: string;
            id: string;
            region: string | null;
            createdAt: Date;
            phone: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            isPhoneVerified: boolean;
        };
        images: {
            id: string;
            listingId: string;
            url: string;
            order: number;
        }[];
        documents: {
            id: string;
            listingId: string;
            type: import(".prisma/client").$Enums.ListingDocumentType;
            fileUrl: string;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        }[];
    } & {
        id: string;
        sellerId: string;
        title: string;
        description: string;
        region: string;
        district: string | null;
        sizeSqm: number;
        price: Prisma.Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    generateInfoSheet(id: string): Promise<{
        buffer: Buffer<ArrayBufferLike>;
        filename: string;
    }>;
    update(sellerId: string, id: string, dto: UpdateListingDto): Promise<{
        images: {
            id: string;
            listingId: string;
            url: string;
            order: number;
        }[];
        documents: {
            id: string;
            listingId: string;
            type: import(".prisma/client").$Enums.ListingDocumentType;
            fileUrl: string;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        }[];
    } & {
        id: string;
        sellerId: string;
        title: string;
        description: string;
        region: string;
        district: string | null;
        sizeSqm: number;
        price: Prisma.Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    markSold(sellerId: string, id: string, dto: MarkListingSoldDto): Promise<{
        listing: {
            seller: {
                name: string;
                id: string;
                region: string | null;
                createdAt: Date;
                phone: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                isPhoneVerified: boolean;
            };
            images: {
                id: string;
                listingId: string;
                url: string;
                order: number;
            }[];
            documents: {
                id: string;
                listingId: string;
                type: import(".prisma/client").$Enums.ListingDocumentType;
                fileUrl: string;
                reviewedAt: Date | null;
                reviewedBy: string | null;
            }[];
        } & {
            id: string;
            sellerId: string;
            title: string;
            description: string;
            region: string;
            district: string | null;
            sizeSqm: number;
            price: Prisma.Decimal;
            currency: string;
            latitude: number | null;
            longitude: number | null;
            status: import(".prisma/client").$Enums.ListingStatus;
            rejectionNote: string | null;
            createdAt: Date;
        };
        saleRecord: {
            reportUrl: string | null;
            id: string;
            createdAt: Date;
            listingId: string;
            salePrice: Prisma.Decimal;
            saleDate: Date;
            paymentMethod: string;
            documentReference: string | null;
            buyerName: string;
            buyerPhone: string;
            buyerEmail: string | null;
            reportS3Key: string | null;
            updatedAt: Date;
        };
    }>;
    markSoldByAdmin(id: string, dto: MarkListingSoldDto): Promise<{
        listing: {
            seller: {
                name: string;
                id: string;
                region: string | null;
                createdAt: Date;
                phone: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                isPhoneVerified: boolean;
            };
            images: {
                id: string;
                listingId: string;
                url: string;
                order: number;
            }[];
            documents: {
                id: string;
                listingId: string;
                type: import(".prisma/client").$Enums.ListingDocumentType;
                fileUrl: string;
                reviewedAt: Date | null;
                reviewedBy: string | null;
            }[];
        } & {
            id: string;
            sellerId: string;
            title: string;
            description: string;
            region: string;
            district: string | null;
            sizeSqm: number;
            price: Prisma.Decimal;
            currency: string;
            latitude: number | null;
            longitude: number | null;
            status: import(".prisma/client").$Enums.ListingStatus;
            rejectionNote: string | null;
            createdAt: Date;
        };
        saleRecord: {
            reportUrl: string | null;
            id: string;
            createdAt: Date;
            listingId: string;
            salePrice: Prisma.Decimal;
            saleDate: Date;
            paymentMethod: string;
            documentReference: string | null;
            buyerName: string;
            buyerPhone: string;
            buyerEmail: string | null;
            reportS3Key: string | null;
            updatedAt: Date;
        };
    }>;
    remove(sellerId: string, id: string): Promise<{
        id: string;
        sellerId: string;
        title: string;
        description: string;
        region: string;
        district: string | null;
        sizeSqm: number;
        price: Prisma.Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    private assertSellerOwnsListing;
    private recordSale;
    private slugify;
}
