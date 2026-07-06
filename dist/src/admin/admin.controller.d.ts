import { MarkListingSoldDto } from '../listings/dto/mark-listing-sold.dto';
import { ListingsService } from '../listings/listings.service';
import { ReviewListingDto } from './dto/review-listing.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    private readonly listingsService;
    constructor(adminService: AdminService, listingsService: ListingsService);
    pendingListings(): import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    approveListing(id: string): import(".prisma/client").Prisma.Prisma__ListingClient<{
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
    rejectListing(id: string, dto: ReviewListingDto): import(".prisma/client").Prisma.Prisma__ListingClient<{
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
    markListingSold(id: string, dto: MarkListingSoldDto): Promise<{
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
    pendingDocuments(): import(".prisma/client").Prisma.PrismaPromise<({
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
    } & {
        id: string;
        listingId: string;
        type: import(".prisma/client").$Enums.ListingDocumentType;
        fileUrl: string;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    })[]>;
}
