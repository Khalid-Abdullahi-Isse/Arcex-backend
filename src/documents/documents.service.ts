import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddListingDocumentDto } from './dto/add-listing-document.dto';
import { CreateDocumentUploadUrlDto } from './dto/create-document-upload-url.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
import { createLocalUploadUrls } from '../uploads/local-upload-url';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createUploadUrl(userId: string, listingId: string, dto: CreateDocumentUploadUrlDto) {
    await this.assertSellerOwnsListing(userId, listingId);
    return createLocalUploadUrls(`listings/${listingId}/documents/${dto.type}`, dto.fileName, dto.contentType);
  }

  async addDocument(userId: string, listingId: string, dto: AddListingDocumentDto) {
    await this.assertSellerOwnsListing(userId, listingId);
    return this.prisma.listingDocument.create({ data: { ...dto, listingId } });
  }

  review(documentId: string, reviewedBy: string, dto: ReviewDocumentDto) {
    return this.prisma.listingDocument.update({
      where: { id: documentId },
      data: { reviewedAt: new Date(), reviewedBy },
    });
  }

  private async assertSellerOwnsListing(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== userId) throw new ForbiddenException('Seller access required');
  }
}
