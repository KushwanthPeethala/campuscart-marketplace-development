/**
 * Loads the frontend's mock data (data/seed.json) into MongoDB.
 *   npm run seed         -> upsert (safe to run repeatedly)
 *   npm run seed:fresh   -> wipe categories + products + seed users first
 */
import crypto from 'crypto'
import fs from 'fs'
import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import { connectDB } from '../src/config/db.js'
import { Category } from '../src/models/Category.js'
import { Product } from '../src/models/Product.js'
import { User } from '../src/models/User.js'

const SEED_DOMAIN = 'seed.campuscart.local'
const data = JSON.parse(fs.readFileSync(new URL('../data/seed.json', import.meta.url), 'utf8'))
const fresh = process.argv.includes('--fresh')

await connectDB()

if (fresh) {
  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), User.deleteMany({ email: new RegExp(`@${SEED_DOMAIN}$`) })])
  console.log('Cleared categories, products and seed users')
}

// Categories
await Category.bulkWrite(
  data.categories.map((c) => ({ updateOne: { filter: { slug: c.slug }, update: { $set: c }, upsert: true } })),
)

// Sellers: real User documents with unusable random passwords (they cannot log in).
const sellerIds = {}
for (const s of data.sellers) {
  const email = `${s.id.replace(/^s-/, '')}@${SEED_DOMAIN}`
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: { name: s.name, course: s.course, college: s.college, isVerified: true },
      $setOnInsert: { passwordHash: await User.hashPassword(crypto.randomBytes(24).toString('hex')) },
    },
    { upsert: true, new: true },
  )
  sellerIds[s.id] = user._id
}

// Products
const featured = new Set(data.featuredIds)
await Product.bulkWrite(
  data.products.map(({ id, sellerId, listedAt, ...p }) => ({
    updateOne: {
      filter: { slug: id },
      update: {
        $set: { ...p, slug: id, seller: sellerIds[sellerId], listedAt: new Date(listedAt), featured: featured.has(id) },
        $setOnInsert: { listingType: 'sell', status: 'available' },
      },
      upsert: true,
    },
  })),
)

// Dev-only logins so you can test auth, wishlist and selling immediately.
if (!env.isProd) {
  for (const [email, name, role] of [
    [`demo@${SEED_DOMAIN}`, 'Demo Student', 'student'],
    [`admin@${SEED_DOMAIN}`, 'Campus Admin', 'admin'],
  ]) {
    await User.findOneAndUpdate(
      { email },
      { $set: { name, role, isVerified: true, college: 'Demo University' }, $setOnInsert: { passwordHash: await User.hashPassword('Demo@12345') } },
      { upsert: true },
    )
  }
  console.log(`Dev logins: demo@${SEED_DOMAIN} / admin@${SEED_DOMAIN}  (password: Demo@12345)`)
}

console.log(`Seeded ${data.categories.length} categories, ${data.sellers.length} sellers, ${data.products.length} products`)
await mongoose.connection.close()
