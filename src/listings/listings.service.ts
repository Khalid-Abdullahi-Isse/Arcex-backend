import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ListingStatus, Prisma } from '@prisma/client';
import { PdfService } from '../pdf/pdf.service';
import { PrismaService } from '../prisma/prisma.service';
import { createLocalDownloadUrl, writeLocalObject } from '../uploads/local-upload-url';
import { CreateListingDto } from './dto/create-listing.dto';
import { MarkListingSoldDto } from './dto/mark-listing-sold.dto';
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
  private readonly logger = new Logger(ListingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
  ) {}

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
    };

    if (query.region) {
      where.region = query.region;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {
        gte: query.minPrice !== undefined ? new Prisma.Decimal(query.minPrice) : undefined,
        lte: query.maxPrice !== undefined ? new Prisma.Decimal(query.maxPrice) : undefined,
      };
    }

    if (query.minSizeSqm !== undefined || query.maxSizeSqm !== undefined) {
      where.sizeSqm = {
        gte: query.minSizeSqm,
        lte: query.maxSizeSqm,
      };
    }

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

  async generateInfoSheet(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        seller: { select: publicSellerSelect },
      },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.status !== ListingStatus.APPROVED && listing.status !== ListingStatus.SOLD) {
      throw new BadRequestException('Only approved or sold listings can be exported as info sheets');
    }

    const buffer = await this.pdfService.generateListingInfoSheet({
      listing,
      images: listing.images,
      seller: listing.seller,
    });

    return {
      buffer,
      filename: `acrex-land-${listing.id}-${this.slugify(listing.title)}.pdf`,
    };
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

  async markSold(sellerId: string, id: string, dto: MarkListingSoldDto) {
    await this.assertSellerOwnsListing(sellerId, id);
    return this.recordSale(id, dto);
  }

  async markSoldByAdmin(id: string, dto: MarkListingSoldDto) {
    return this.recordSale(id, dto);
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

  private async recordSale(id: string, dto: MarkListingSoldDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const listing = await tx.listing.update({
        where: { id },
        data: { status: ListingStatus.SOLD },
        include: {
          seller: { select: publicSellerSelect },
          images: { orderBy: { order: 'asc' } },
          documents: true,
        },
      });

      const saleRecord = await tx.saleRecord.create({
        data: {
          listingId: id,
          salePrice: new Prisma.Decimal(dto.salePrice),
          saleDate: new Date(dto.saleDate),
          paymentMethod: dto.paymentMethod,
          documentReference: dto.documentReference,
          buyerName: dto.buyerName,
          buyerPhone: dto.buyerPhone,
          buyerEmail: dto.buyerEmail?.toLowerCase(),
        },
      });

      return { listing, saleRecord };
    });

    let saleRecord = result.saleRecord;
    try {
      const buffer = await this.pdfService.generateSaleReport({
        listing: result.listing,
        saleRecord,
        seller: result.listing.seller,
      });
      const key = `sale-reports/${id}/${saleRecord.id}.pdf`;
      await writeLocalObject(key, buffer);
      saleRecord = await this.prisma.saleRecord.update({
        where: { id: saleRecord.id },
        data: { reportS3Key: key },
      });
    } catch (error) {
      this.logger.error(`Failed to generate sale report for listing ${id}`, error);
    }

    return {
      listing: result.listing,
      saleRecord: {
        ...saleRecord,
        reportUrl: saleRecord.reportS3Key ? createLocalDownloadUrl(saleRecord.reportS3Key) : null,
      },
    };
  }

  private slugify(value: string) {
    return (
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'listing'
    );
  }
}
