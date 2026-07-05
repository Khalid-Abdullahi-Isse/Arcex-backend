import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ListingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

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
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(sellerId: string, dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        ...dto,
        sellerId,
        price: new Prisma.Decimal(dto.price),
      },
      include: { images: { orderBy: { order: 'asc' } }, documents: true },
    });
  }

  async search(query: SearchListingsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.ListingWhereInput = {
      status: ListingStatus.APPROVED,
      region: query.region,
      price: {
        gte: query.minPrice !== undefined ? new Prisma.Decimal(query.minPrice) : undefined,
        lte: query.maxPrice !== undefined ? new Prisma.Decimal(query.maxPrice) : undefined,
      },
      sizeSqm: {
        gte: query.minSizeSqm,
        lte: query.maxSizeSqm,
      },
    };

    const [items, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        include: { images: { orderBy: { order: 'asc' } }, seller: { select: publicSellerSelect } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.listing.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        documents: true,
        seller: { select: publicSellerSelect },
      },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async update(sellerId: string, id: string, dto: UpdateListingDto) {
    await this.assertSellerOwnsListing(sellerId, id);
    return this.prisma.listing.update({
      where: { id },
      data: {
        ...dto,
        price: dto.price !== undefined ? new Prisma.Decimal(dto.price) : undefined,
        status: ListingStatus.PENDING_REVIEW,
        rejectionNote: null,
      },
      include: { images: { orderBy: { order: 'asc' } }, documents: true },
    });
  }

  async markSold(sellerId: string, id: string) {
    await this.assertSellerOwnsListing(sellerId, id);
    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.SOLD },
    });
  }

  async remove(sellerId: string, id: string) {
    await this.assertSellerOwnsListing(sellerId, id);
    return this.prisma.listing.delete({ where: { id } });
  }

  private async assertSellerOwnsListing(sellerId: string, id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== sellerId) throw new ForbiddenException('Seller access required');
  }
}
