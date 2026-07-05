import { Injectable } from '@nestjs/common';
import { ListingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewListingDto } from './dto/review-listing.dto';

const publicSellerSelect = {
  id: true,
  phone: true,
  email: true,
  name: true,
  role: true,
  region: true,
  isPhoneVerified: true,
  createdAt: true,
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  pendingListings() {
    return this.prisma.listing.findMany({
      where: { status: ListingStatus.PENDING_REVIEW },
      include: { seller: { select: publicSellerSelect }, images: { orderBy: { order: 'asc' } }, documents: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  approveListing(id: string) {
    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.APPROVED, rejectionNote: null },
    });
  }

  rejectListing(id: string, dto: ReviewListingDto) {
    return this.prisma.listing.update({
      where: { id },
      data: {
        status: ListingStatus.REJECTED,
        rejectionNote: dto.rejectionNote ?? 'Rejected by admin review',
      },
    });
  }

  pendingDocuments() {
    return this.prisma.listingDocument.findMany({
      where: { reviewedAt: null },
      include: { listing: { include: { seller: { select: publicSellerSelect } } } },
    });
  }
}
