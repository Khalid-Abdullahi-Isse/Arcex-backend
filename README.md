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

## Deploy to Render

This backend is configured for Render with `render.yaml`.

1. Push the `backend` repository to GitHub/GitLab.
2. In Render, create a new Blueprint from this repository.
3. Render will create:
   - `acrex-backend` as a Node web service
   - `acrex-db` as a Render PostgreSQL database
4. During Blueprint creation, fill the prompted secret values:
   - `CORS_ORIGIN`: your frontend origin, for example `https://your-web-app.com`
   - `S3_BUCKET`: use your real bucket value, or `local` while testing
   - `S3_REGION`: use your real region value, or `local` while testing
   - `SMS_API_KEY`: use your real key, or `local` while testing
5. The deploy runs `npm ci && npm run build`, then `npm run prisma:deploy`, then starts with `npm run start:prod`.

If the Next.js frontend is deployed separately, set its `BACKEND_URL` environment variable to the Render backend URL, for example `https://acrex-backend.onrender.com`.

Render PostgreSQL on the free plan is useful for testing, but do not use it for important production data. Uploaded files currently use the local `uploads` directory; use object storage or attach a Render persistent disk before relying on uploaded photos/documents in production.

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
