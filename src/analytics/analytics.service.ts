import { Injectable } from '@nestjs/common';
import { ListingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DateRangeQueryDto, SalesTrendQueryDto } from './dto/analytics-query.dto';

type SummaryRow = { totalSales: bigint | number | null; totalValue: Prisma.Decimal | number | null; avgPrice: Prisma.Decimal | number | null };
type TrendRow = { period: Date; count: bigint | number; totalValue: Prisma.Decimal | number | null };
type RegionRow = { region: string | null; count: bigint | number; totalValue: Prisma.Decimal | number | null; avgPrice: Prisma.Decimal | number | null };
type ListedVsSoldRow = { totalListedValue: Prisma.Decimal | number | null; totalSoldValue: Prisma.Decimal | number | null };

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async salesSummary(query: DateRangeQueryDto) {
    const [row] = await this.prisma.$queryRaw<SummaryRow[]>`
      SELECT
        COUNT(*) AS "totalSales",
        COALESCE(SUM(sr."sale_price"), 0) AS "totalValue",
        COALESCE(AVG(sr."sale_price"), 0) AS "avgPrice"
      FROM "sale_records" sr
      WHERE sr."sale_price" IS NOT NULL
        AND sr."sale_date" IS NOT NULL
        ${this.dateFilter(query)}
    `;

    return {
      totalSales: this.toNumber(row?.totalSales),
      totalValue: this.toNumber(row?.totalValue),
      avgPrice: this.toNumber(row?.avgPrice),
    };
  }

  async salesTrend(query: SalesTrendQueryDto) {
    const granularity = query.granularity ?? 'month';
    const dateTrunc = this.dateTrunc(granularity);

    const rows = await this.prisma.$queryRaw<TrendRow[]>(Prisma.sql`
      SELECT
        ${dateTrunc} AS "period",
        COUNT(*) AS "count",
        COALESCE(SUM(sr."sale_price"), 0) AS "totalValue"
      FROM "sale_records" sr
      WHERE sr."sale_price" IS NOT NULL
        AND sr."sale_date" IS NOT NULL
        ${this.dateFilter(query)}
      GROUP BY 1
      ORDER BY 1 ASC
    `);

    return rows.map((row) => ({
      period: this.formatPeriod(row.period, granularity),
      count: this.toNumber(row.count),
      totalValue: this.toNumber(row.totalValue),
    }));
  }

  async byRegion(query: DateRangeQueryDto) {
    const rows = await this.prisma.$queryRaw<RegionRow[]>(Prisma.sql`
      SELECT
        COALESCE(NULLIF(l."region", ''), 'Unknown') AS "region",
        COUNT(*) AS "count",
        COALESCE(SUM(sr."sale_price"), 0) AS "totalValue",
        COALESCE(AVG(sr."sale_price"), 0) AS "avgPrice"
      FROM "sale_records" sr
      JOIN "Listing" l ON l."id" = sr."listing_id"
      WHERE sr."sale_price" IS NOT NULL
        AND sr."sale_date" IS NOT NULL
        ${this.dateFilter(query)}
      GROUP BY 1
      ORDER BY "totalValue" DESC
    `);

    return rows.map((row) => ({
      region: row.region ?? 'Unknown',
      count: this.toNumber(row.count),
      totalValue: this.toNumber(row.totalValue),
      avgPrice: this.toNumber(row.avgPrice),
    }));
  }

  async statusBreakdown() {
    const rows = await this.prisma.listing.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const counts = {
      pendingReview: 0,
      approved: 0,
      sold: 0,
      rejected: 0,
    };

    for (const row of rows) {
      if (row.status === ListingStatus.PENDING_REVIEW) counts.pendingReview = row._count._all;
      if (row.status === ListingStatus.APPROVED) counts.approved = row._count._all;
      if (row.status === ListingStatus.SOLD) counts.sold = row._count._all;
      if (row.status === ListingStatus.REJECTED) counts.rejected = row._count._all;
    }

    return counts;
  }

  async listedVsSoldValue(query: DateRangeQueryDto) {
    const [row] = await this.prisma.$queryRaw<ListedVsSoldRow[]>(Prisma.sql`
      SELECT
        (
          SELECT COALESCE(SUM(l."price"), 0)
          FROM "Listing" l
          WHERE l."status" = 'APPROVED'::"ListingStatus"
        ) AS "totalListedValue",
        (
          SELECT COALESCE(SUM(sr."sale_price"), 0)
          FROM "sale_records" sr
          WHERE sr."sale_price" IS NOT NULL
            AND sr."sale_date" IS NOT NULL
            ${this.dateFilter(query)}
        ) AS "totalSoldValue"
    `);

    return {
      totalListedValue: this.toNumber(row?.totalListedValue),
      totalSoldValue: this.toNumber(row?.totalSoldValue),
    };
  }

  private dateFilter(query: DateRangeQueryDto) {
    const clauses: Prisma.Sql[] = [];
    if (query.from) clauses.push(Prisma.sql`AND sr."sale_date" >= ${new Date(query.from)}`);
    if (query.to) clauses.push(Prisma.sql`AND sr."sale_date" <= ${new Date(query.to)}`);
    return clauses.length ? Prisma.join(clauses, ' ') : Prisma.empty;
  }

  private dateTrunc(granularity: 'day' | 'week' | 'month') {
    if (granularity === 'day') return Prisma.sql`date_trunc('day', sr."sale_date")`;
    if (granularity === 'week') return Prisma.sql`date_trunc('week', sr."sale_date")`;
    return Prisma.sql`date_trunc('month', sr."sale_date")`;
  }

  private formatPeriod(date: Date, granularity: 'day' | 'week' | 'month') {
    const iso = date.toISOString();
    if (granularity === 'month') return iso.slice(0, 7);
    return iso.slice(0, 10);
  }

  private toNumber(value: bigint | number | Prisma.Decimal | null | undefined) {
    if (typeof value === 'bigint') return Number(value);
    if (value instanceof Prisma.Decimal) return value.toNumber();
    return Number(value ?? 0);
  }
}
