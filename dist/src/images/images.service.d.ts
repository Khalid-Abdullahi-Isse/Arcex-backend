import { PrismaService } from '../prisma/prisma.service';
import { AddListingImageDto } from './dto/add-listing-image.dto';
import { CreateImageUploadUrlDto } from './dto/create-image-upload-url.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
export declare class ImagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUploadUrl(userId: string, listingId: string, dto: CreateImageUploadUrlDto): Promise<{
        uploadUrl: string;
        fileUrl: string;
        method: string;
        contentType: string;
    }>;
    addImage(userId: string, listingId: string, dto: AddListingImageDto): Promise<{
        id: string;
        order: number;
        listingId: string;
        url: string;
    }>;
    reorder(userId: string, listingId: string, dto: ReorderImagesDto): Promise<{
        id: string;
        order: number;
        listingId: string;
        url: string;
    }[]>;
    remove(userId: string, listingId: string, imageId: string): Promise<{
        id: string;
        order: number;
        listingId: string;
        url: string;
    }>;
    private assertSellerOwnsListing;
}
