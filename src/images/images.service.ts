import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddListingImageDto } from './dto/add-listing-image.dto';
import { CreateImageUploadUrlDto } from './dto/create-image-upload-url.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import { createLocalUploadUrls } from '../uploads/local-upload-url';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createUploadUrl(userId: string, listingId: string, dto: CreateImageUploadUrlDto) {
    await this.assertSellerOwnsListing(userId, listingId);
    return createLocalUploadUrls(`listings/${listingId}/photos`, dto.fileName, dto.contentType);
  }

  async addImage(userId: string, listingId: string, dto: AddListingImageDto) {
    await this.assertSellerOwnsListing(userId, listingId);
    return this.prisma.listingImage.create({ data: { ...dto, listingId } });
  }

  async reorder(userId: string, listingId: string, dto: ReorderImagesDto) {
    await this.assertSellerOwnsListing(userId, listingId);
    await this.prisma.$transaction(
      dto.images.map((image) =>
        this.prisma.listingImage.update({
          where: { id: image.id },
          data: { order: image.order },
        }),
      ),
    );
    return this.prisma.listingImage.findMany({ where: { listingId }, orderBy: { order: 'asc' } });
  }

  async remove(userId: string, listingId: string, imageId: string) {
    await this.assertSellerOwnsListing(userId, listingId);
    return this.prisma.listingImage.delete({ where: { id: imageId } });
  }

  private async assertSellerOwnsListing(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== userId) throw new ForbiddenException('Seller access required');
  }
}
