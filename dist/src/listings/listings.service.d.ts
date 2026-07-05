import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
export declare class ListingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(sellerId: string, dto: CreateListingDto): Prisma.Prisma__ListingClient<{
        images: {
            id: string;
            order: number;
            listingId: string;
            url: string;
        }[];
        documents: {
            id: string;
            listingId: string;
            type: import("@prisma/client").$Enums.ListingDocumentType;
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
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    search(query: SearchListingsDto): Promise<{
        items: ({
            seller: {
                id: string;
                region: string | null;
                createdAt: Date;
                phone: string;
                email: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                isPhoneVerified: boolean;
            };
            images: {
                id: string;
                order: number;
                listingId: string;
                url: string;
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
            status: import("@prisma/client").$Enums.ListingStatus;
            rejectionNote: string | null;
            createdAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        seller: {
            id: string;
            region: string | null;
            createdAt: Date;
            phone: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            isPhoneVerified: boolean;
        };
        images: {
            id: string;
            order: number;
            listingId: string;
            url: string;
        }[];
        documents: {
            id: string;
            listingId: string;
            type: import("@prisma/client").$Enums.ListingDocumentType;
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
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    update(sellerId: string, id: string, dto: UpdateListingDto): Promise<{
        images: {
            id: string;
            order: number;
            listingId: string;
            url: string;
        }[];
        documents: {
            id: string;
            listingId: string;
            type: import("@prisma/client").$Enums.ListingDocumentType;
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
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    markSold(sellerId: string, id: string): Promise<{
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
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
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
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    private assertSellerOwnsListing;
}
