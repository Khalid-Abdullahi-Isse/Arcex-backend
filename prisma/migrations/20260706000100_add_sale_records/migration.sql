CREATE TABLE "sale_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "listing_id" UUID NOT NULL,
    "sale_price" DECIMAL(14,2) NOT NULL,
    "sale_date" TIMESTAMP(3) NOT NULL,
    "payment_method" TEXT NOT NULL,
    "document_reference" TEXT,
    "buyer_name" TEXT NOT NULL,
    "buyer_phone" TEXT NOT NULL,
    "buyer_email" TEXT,
    "report_s3_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "sale_records_sale_price_positive" CHECK ("sale_price" > 0)
);

CREATE UNIQUE INDEX "sale_records_listing_id_key" ON "sale_records"("listing_id");
CREATE INDEX "sale_records_sale_date_idx" ON "sale_records"("sale_date");

ALTER TABLE "sale_records"
ADD CONSTRAINT "sale_records_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "Listing"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
