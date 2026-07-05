import { AddListingDocumentDto } from './dto/add-listing-document.dto';
import { CreateDocumentUploadUrlDto } from './dto/create-document-upload-url.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    createUploadUrl(request: {
        user: {
            sub: string;
        };
    }, listingId: string, dto: CreateDocumentUploadUrlDto): Promise<{
        uploadUrl: string;
        fileUrl: string;
        method: string;
        contentType: string;
    }>;
    addDocument(request: {
        user: {
            sub: string;
        };
    }, listingId: string, dto: AddListingDocumentDto): Promise<{
        id: string;
        listingId: string;
        type: import("@prisma/client").$Enums.ListingDocumentType;
        fileUrl: string;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }>;
    review(request: {
        user: {
            phone: string;
        };
    }, documentId: string, dto: ReviewDocumentDto): import("@prisma/client").Prisma.Prisma__ListingDocumentClient<{
        id: string;
        listingId: string;
        type: import("@prisma/client").$Enums.ListingDocumentType;
        fileUrl: string;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
