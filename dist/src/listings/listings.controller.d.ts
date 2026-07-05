import { CreateListingDto } from './dto/create-listing.dto';
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
    }, dto: CreateListingDto): import("@prisma/client").Prisma.Prisma__ListingClient<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
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
            price: import("@prisma/client/runtime/library").Decimal;
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
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    update(request: {
        user: {
            sub: string;
        };
    }, id: string, dto: UpdateListingDto): Promise<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        latitude: number | null;
        longitude: number | null;
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
    markSold(request: {
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
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
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
        status: import("@prisma/client").$Enums.ListingStatus;
        rejectionNote: string | null;
        createdAt: Date;
    }>;
}
