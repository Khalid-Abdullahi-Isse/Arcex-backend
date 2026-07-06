CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "ListingStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SOLD');
CREATE TYPE "ListingDocumentType" AS ENUM ('TITLE_DEED', 'ID_CARD', 'SURVEY_MAP', 'OTHER');

CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "region" TEXT,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Listing" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "district" TEXT,
    "sizeSqm" DOUBLE PRECISION NOT NULL,
    "price" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "ListingStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "rejectionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ListingImage" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ListingImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ListingDocument" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "type" "ListingDocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "ListingDocument_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Listing_region_idx" ON "Listing"("region");
CREATE INDEX "Listing_status_idx" ON "Listing"("status");
CREATE INDEX "Listing_price_idx" ON "Listing"("price");
CREATE INDEX "Listing_sizeSqm_idx" ON "Listing"("sizeSqm");
CREATE UNIQUE INDEX "ListingImage_listingId_order_key" ON "ListingImage"("listingId", "order");
CREATE INDEX "ListingImage_listingId_idx" ON "ListingImage"("listingId");
CREATE INDEX "ListingDocument_listingId_idx" ON "ListingDocument"("listingId");
CREATE INDEX "ListingDocument_type_idx" ON "ListingDocument"("type");

ALTER TABLE "Listing"
ADD CONSTRAINT "Listing_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ListingImage"
ADD CONSTRAINT "ListingImage_listingId_fkey"
FOREIGN KEY ("listingId") REFERENCES "Listing"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ListingDocument"
ADD CONSTRAINT "ListingDocument_listingId_fkey"
FOREIGN KEY ("listingId") REFERENCES "Listing"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
