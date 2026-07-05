# AcreX Backend

NestJS API for a Somalia land listings marketplace. The app handles land listings, listing media, verification documents, users, and admin review; it does not process payments or chat.

## Setup

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run start:dev
```

## Database

Prisma models live in `prisma/schema.prisma`. Listings support multiple images through `ListingImage` and title/supporting documents through `ListingDocument`. Buyer/seller contact is handled outside the API, for example via the seller phone shown on a listing.

## Auth

Auth is email + password based, and phone number is required for every account. Passwords are stored as bcrypt hashes. JWT auth is global, and routes can opt out with `@Public()`.

## Main Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /listings`
- `POST /listings`
- `PATCH /listings/:id/sold`
- `POST /listings/:listingId/images/upload-url`
- `PATCH /listings/:listingId/images/reorder`
- `POST /listings/:listingId/documents/upload-url`
- `GET /admin/listings/pending`
