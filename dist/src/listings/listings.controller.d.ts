import type { Response } from 'express';
import { CreateListingDto } from './dto/create-listing.dto';
import { MarkListingSoldDto } from './dto/mark-listing-sold.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingsService } from './listings.service';
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    create(request: {
        user: {
            sub: string;
        };
    }, dto: CreateListingDto): import(".prisma/client").Prisma.Prisma__ListingClient<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
            price: import("@prisma/client/runtime/library").Decimal;
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
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    infoSheet(id: string, response: Response): Promise<void>;
    update(request: {
        user: {
            sub: string;
        };
    }, id: string, dto: UpdateListingDto): Promise<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    markSold(request: {
        user: {
            sub: string;
        };
    }, id: string, dto: MarkListingSoldDto): Promise<{
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
            price: import("@prisma/client/runtime/library").Decimal;
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
    }>;
    remove(request: {
        user: {
            sub: string;
        };
    }, id: string): Promise<{
        id: string;
        sellerId: string;
        title: string;
        description: string;
        region: string;
        district: string | null;
        sizeSqm: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
}
