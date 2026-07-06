import { PrismaService } from '../prisma/prisma.service';
import { AddListingDocumentDto } from './dto/add-listing-document.dto';
import { CreateDocumentUploadUrlDto } from './dto/create-document-upload-url.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
export declare class DocumentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUploadUrl(userId: string, listingId: string, dto: CreateDocumentUploadUrlDto): Promise<{
        uploadUrl: string;
        fileUrl: string;
        method: string;
        contentType: string;
    }>;
    addDocument(userId: string, listingId: string, dto: AddListingDocumentDto): Promise<{
        id: string;
        listingId: string;
        type: import(".prisma/client").$Enums.ListingDocumentType;
        fileUrl: string;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }>;
    review(documentId: string, reviewedBy: string, dto: ReviewDocumentDto): import(".prisma/client").Prisma.Prisma__ListingDocumentClient<{
        id: string;
        listingId: string;
        type: import(".prisma/client").$Enums.ListingDocumentType;
        fileUrl: string;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    private assertSellerOwnsListing;
}
