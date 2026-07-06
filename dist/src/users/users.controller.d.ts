import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(request: {
        user: {
            sub: string;
        };
    }): Promise<{
        name: string;
        id: string;
        region: string | null;
        createdAt: Date;
        phone: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isPhoneVerified: boolean;
    }>;
    myListings(request: {
        user: {
            sub: string;
        };
    }): import(".prisma/client").Prisma.PrismaPromise<({
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
    updateMe(request: {
        user: {
            sub: string;
        };
    }, dto: UpdateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        id: string;
        region: string | null;
        createdAt: Date;
        phone: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isPhoneVerified: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
