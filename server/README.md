# CampusCart API (Express + MongoDB)

REST API for the CampusCart frontend (Next.js, in the repo root).

## Quick start

```bash
cd server
cp .env.example .env        # then edit MONGODB_URI, JWT_SECRET, ALLOWED_EMAIL_DOMAINS
npm install
npm run seed                # loads the 14 mock products, 6 categories, 6 sellers
npm run dev                 # http://localhost:5000
```

`npm run seed` is safe to repeat. `npm run seed:fresh` wipes categories, products and seed users first.
In development the seed also creates two logins (password `Demo@12345`):
`demo@seed.campuscart.local` (student) and `admin@seed.campuscart.local` (admin). They are never created when `NODE_ENV=production`.

MongoDB: install locally, or create a free Atlas cluster and paste its connection string into `MONGODB_URI`.

## Endpoints

Base URL: `http://localhost:5000/api`. Protected routes need `Authorization: Bearer <token>`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health` | | API + DB status |
| POST | `/auth/register` | | `name, email, password, course?, college?`. Email must match `ALLOWED_EMAIL_DOMAINS` |
| POST | `/auth/login` | | returns `{ token, user }` |
| GET | `/auth/verify-email/:token` | | used when `REQUIRE_EMAIL_VERIFICATION=true` |
| GET / PATCH | `/auth/me` | yes | current user / update name, course, college |
| GET | `/categories` | | |
| GET | `/categories/counts` | | `{ books: 2, ... }` (excludes sold items) |
| GET | `/categories/:slug` | | |
| GET | `/products` | | `q, category, condition, listingType, status, minPrice, maxPrice, sort (newest/price-asc/price-desc), page, limit` returns `{ items, page, limit, total, totalPages }`. Sold items are hidden unless `status=sold` |
| GET | `/products/featured` | | up to 8 |
| GET | `/products/by-ids?ids=a,b` | | slugs or ObjectIds |
| GET | `/products/mine` | yes | your listings, all statuses |
| GET | `/products/:id` | | `:id` is the slug (same id the frontend uses) |
| GET | `/products/:id/similar` | | same category |
| POST | `/products` | yes | `multipart/form-data`, up to 5 images in field `images` (JPG/PNG/WebP, 5 MB each) |
| PUT | `/products/:id` | owner/admin | same fields, all optional. `removeImages` = JSON array of image URLs |
| PATCH | `/products/:id/status` | owner/admin | `{ "status": "available" \| "reserved" \| "sold" }` |
| DELETE | `/products/:id` | owner/admin | also deletes its uploaded images and removes it from wishlists |
| GET | `/wishlist` | yes | `{ ids, items }` |
| POST / DELETE | `/wishlist/:id` | yes | add / remove; returns `{ ids, items }` |

Product JSON matches `lib/types.ts` in the frontend, plus `listingType` (`sell`, `exchange`, `both`), `exchangeFor` and `status`.

## Notes

- Uploaded images are stored in `server/uploads/` and served at `/uploads/...`. Render, Railway and similar hosts wipe local disk on redeploy, so move uploads to Cloudinary or S3 before deploying (the only code to change is `middleware/upload.js`).
- Set `ALLOWED_EMAIL_DOMAINS` before going live, otherwise anyone can register.
- Without `SMTP_HOST`, verification links are printed to the server console.
- Passwords are hashed with bcrypt; login errors never reveal whether an email exists; auth routes are rate-limited; request bodies are validated with zod.
