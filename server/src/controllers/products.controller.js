import mongoose from 'mongoose'
import { z } from 'zod'
import { Product, CONDITIONS, LISTING_TYPES, STATUSES } from '../models/Product.js'
import { Category } from '../models/Category.js'
import { User } from '../models/User.js'
import { MAX_IMAGES, fileUrl, removeUploadedUrls } from '../middleware/upload.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { serializeProduct } from '../utils/serializers.js'
import { escapeRegex, makeSlug } from '../utils/slug.js'

const PLACEHOLDER_IMAGE = '/placeholder.jpg' // lives in the Next.js /public folder
const populateSeller = { path: 'seller', select: 'name course college' }

/* ---------- validation schemas ---------- */

export const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().toLowerCase().optional(),
  condition: z.enum(CONDITIONS).optional(),
  listingType: z.enum(LISTING_TYPES).optional(),
  status: z.enum(STATUSES).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// Multipart bodies arrive as strings, so numbers are coerced.
const money = z.coerce.number().min(0).max(10_000_000)
const productFields = {
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(10).max(2000),
  price: money,
  originalPrice: money.optional(),
  condition: z.enum(CONDITIONS),
  category: z.string().trim().toLowerCase().min(1),
  campus: z.string().trim().min(2).max(120),
  listingType: z.enum(LISTING_TYPES).default('sell'),
  exchangeFor: z.string().trim().max(300).optional(),
}

const refine = (s) =>
  s
    .refine((d) => d.originalPrice === undefined || d.originalPrice >= d.price, {
      message: 'originalPrice must be at least the asking price',
      path: ['originalPrice'],
    })
    .refine((d) => d.listingType === 'sell' || d.exchangeFor, {
      message: 'Tell buyers what you would like in exchange',
      path: ['exchangeFor'],
    })

export const createSchema = refine(z.object(productFields))
export const updateSchema = z
  .object({
    ...Object.fromEntries(Object.entries(productFields).map(([k, v]) => [k, v.optional()])),
    removeImages: z.preprocess((v) => {
      if (typeof v !== 'string') return v
      try {
        return JSON.parse(v)
      } catch {
        return null // fails the array check below -> 400
      }
    }, z.array(z.string()).optional()),
  })
  .partial()

export const statusSchema = z.object({ status: z.enum(STATUSES) })

/* ---------- helpers ---------- */

const idFilter = (id) =>
  mongoose.isValidObjectId(id) ? { $or: [{ slug: id }, { _id: id }] } : { slug: id }

async function findProduct(id) {
  const product = await Product.findOne(idFilter(id)).populate(populateSeller)
  if (!product) throw new ApiError(404, 'Product not found')
  return product
}

function assertOwnerOrAdmin(product, user) {
  const isOwner = String(product.seller._id ?? product.seller) === String(user._id)
  if (!isOwner && user.role !== 'admin') throw new ApiError(403, 'You can only change your own listings')
}

async function assertCategory(slug) {
  if (!(await Category.exists({ slug }))) throw new ApiError(400, `Unknown category "${slug}"`)
}

/* ---------- handlers ---------- */

export const listProducts = asyncHandler(async (req, res) => {
  const { q, category, condition, listingType, status, minPrice, maxPrice, sort, page, limit } = req.query
  const filter = { status: status ?? { $ne: 'sold' } }
  if (category) filter.category = category
  if (condition) filter.condition = condition
  if (listingType) filter.listingType = listingType
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {}
    if (minPrice !== undefined) filter.price.$gte = minPrice
    if (maxPrice !== undefined) filter.price.$lte = maxPrice
  }

  if (q) {
    // Same fields the mock service searched: title, description, campus, seller name, category name.
    const rx = new RegExp(escapeRegex(q), 'i')
    const [cats, sellers] = await Promise.all([
      Category.find({ name: rx }).select('slug'),
      User.find({ name: rx }).select('_id').limit(50),
    ])
    filter.$or = [
      { title: rx },
      { description: rx },
      { campus: rx },
      ...(cats.length ? [{ category: { $in: cats.map((c) => c.slug) } }] : []),
      ...(sellers.length ? [{ seller: { $in: sellers.map((s) => s._id) } }] : []),
    ]
  }

  const sortBy = { newest: { listedAt: -1, _id: -1 }, 'price-asc': { price: 1, _id: 1 }, 'price-desc': { price: -1, _id: 1 } }[sort]
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortBy).skip((page - 1) * limit).limit(limit).populate(populateSeller),
    Product.countDocuments(filter),
  ])
  res.json({ items: items.map(serializeProduct), page, limit, total, totalPages: Math.ceil(total / limit) })
})

export const featuredProducts = asyncHandler(async (_req, res) => {
  const items = await Product.find({ featured: true, status: { $ne: 'sold' } })
    .sort({ listedAt: -1 })
    .limit(8)
    .populate(populateSeller)
  res.json(items.map(serializeProduct))
})

export const productsByIds = asyncHandler(async (req, res) => {
  const ids = String(req.query.ids || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 50)
  if (!ids.length) return res.json([])
  const items = await Product.find({ $or: ids.map(idFilter).flatMap((f) => f.$or ?? [f]) }).populate(populateSeller)
  res.json(items.map(serializeProduct))
})

export const myProducts = asyncHandler(async (req, res) => {
  const items = await Product.find({ seller: req.user._id }).sort({ listedAt: -1 }).populate(populateSeller)
  res.json(items.map(serializeProduct))
})

export const getProduct = asyncHandler(async (req, res) => {
  res.json(serializeProduct(await findProduct(req.params.id)))
})

export const similarProducts = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id)
  const items = await Product.find({ category: product.category, _id: { $ne: product._id }, status: { $ne: 'sold' } })
    .sort({ listedAt: -1 })
    .limit(Math.min(Number(req.query.limit) || 4, 12))
    .populate(populateSeller)
  res.json(items.map(serializeProduct))
})

export const createProduct = asyncHandler(async (req, res) => {
  const data = createSchema.parse(req.body)
  await assertCategory(data.category)
  const images = (req.files ?? []).map((f) => fileUrl(f.filename))

  const product = await Product.create({
    ...data,
    exchangeFor: data.listingType === 'sell' ? '' : data.exchangeFor,
    slug: makeSlug(data.title),
    images: images.length ? images : [PLACEHOLDER_IMAGE],
    seller: req.user._id,
  })
  await product.populate(populateSeller)
  res.status(201).json(serializeProduct(product))
})

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id)
  assertOwnerOrAdmin(product, req.user)

  const { removeImages = [], ...fields } = updateSchema.parse(req.body)
  if (fields.category) await assertCategory(fields.category)

  const merged = { ...product.toObject(), ...fields }
  // Re-run the cross-field rules (originalPrice >= price, exchange needs exchangeFor) on the final values.
  createSchema.parse({
    ...merged,
    originalPrice: merged.originalPrice ?? undefined,
    exchangeFor: merged.exchangeFor || undefined,
  })

  const removed = product.images.filter((u) => removeImages.includes(u))
  const kept = product.images.filter((u) => !removeImages.includes(u))
  const added = (req.files ?? []).map((f) => fileUrl(f.filename))
  if (kept.length + added.length > MAX_IMAGES) throw new ApiError(400, `A listing can have at most ${MAX_IMAGES} images`)

  Object.assign(product, fields)
  if (product.listingType === 'sell') product.exchangeFor = ''
  product.images = [...kept, ...added]
  if (!product.images.length) product.images = [PLACEHOLDER_IMAGE]
  await product.save()
  await removeUploadedUrls(removed)
  res.json(serializeProduct(product))
})

export const setStatus = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id)
  assertOwnerOrAdmin(product, req.user)
  product.status = req.body.status
  await product.save()
  res.json(serializeProduct(product))
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id)
  assertOwnerOrAdmin(product, req.user)
  await Promise.all([
    product.deleteOne(),
    User.updateMany({ wishlist: product._id }, { $pull: { wishlist: product._id } }),
  ])
  await removeUploadedUrls(product.images)
  res.status(204).end()
})
