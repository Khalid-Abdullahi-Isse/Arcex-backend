import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        id: string;
        region: string | null;
        createdAt: Date;
        phone: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        isPhoneVerified: boolean;
    }>;
    update(id: string, dto: UpdateUserDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        region: string | null;
        createdAt: Date;
        phone: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        isPhoneVerified: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    myListings(id: string): import("@prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
}
