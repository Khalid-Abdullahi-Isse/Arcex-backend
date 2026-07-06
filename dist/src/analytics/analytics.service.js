"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async salesSummary(query) {
        const [row] = await this.prisma.$queryRaw `
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
    async salesTrend(query) {
        const granularity = query.granularity ?? 'month';
        const dateTrunc = this.dateTrunc(granularity);
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
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
    async byRegion(query) {
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
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
            if (row.status === client_1.ListingStatus.PENDING_REVIEW)
                counts.pendingReview = row._count._all;
            if (row.status === client_1.ListingStatus.APPROVED)
                counts.approved = row._count._all;
            if (row.status === client_1.ListingStatus.SOLD)
                counts.sold = row._count._all;
            if (row.status === client_1.ListingStatus.REJECTED)
                counts.rejected = row._count._all;
        }
        return counts;
    }
    async listedVsSoldValue(query) {
        const [row] = await this.prisma.$queryRaw(client_1.Prisma.sql `
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
    dateFilter(query) {
        const clauses = [];
        if (query.from)
            clauses.push(client_1.Prisma.sql `AND sr."sale_date" >= ${new Date(query.from)}`);
        if (query.to)
            clauses.push(client_1.Prisma.sql `AND sr."sale_date" <= ${new Date(query.to)}`);
        return clauses.length ? client_1.Prisma.join(clauses, ' ') : client_1.Prisma.empty;
    }
    dateTrunc(granularity) {
        if (granularity === 'day')
            return client_1.Prisma.sql `date_trunc('day', sr."sale_date")`;
        if (granularity === 'week')
            return client_1.Prisma.sql `date_trunc('week', sr."sale_date")`;
        return client_1.Prisma.sql `date_trunc('month', sr."sale_date")`;
    }
    formatPeriod(date, granularity) {
        const iso = date.toISOString();
        if (granularity === 'month')
            return iso.slice(0, 7);
        return iso.slice(0, 10);
    }
    toNumber(value) {
        if (typeof value === 'bigint')
            return Number(value);
        if (value instanceof client_1.Prisma.Decimal)
            return value.toNumber();
        return Number(value ?? 0);
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map