import { AddListingImageDto } from './dto/add-listing-image.dto';
import { CreateImageUploadUrlDto } from './dto/create-image-upload-url.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import { ImagesService } from './images.service';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    createUploadUrl(request: {
        user: {
            sub: string;
        };
    }, listingId: string, dto: CreateImageUploadUrlDto): Promise<{
        uploadUrl: string;
        fileUrl: string;
        method: string;
        contentType: string;
    }>;
    addImage(request: {
        user: {
            sub: string;
        };
    }, listingId: string, dto: AddListingImageDto): Promise<{
        id: string;
        order: number;
        listingId: string;
        url: string;
    }>;
    reorder(request: {
        user: {
            sub: string;
        };
    }, listingId: string, dto: ReorderImagesDto): Promise<{
        id: string;
        order: number;
        listingId: string;
        url: string;
    }[]>;
    remove(request: {
        user: {
            sub: string;
        };
    }, listingId: string, imageId: string): Promise<{
        id: string;
        order: number;
        listingId: string;
        url: string;
    }>;
}
