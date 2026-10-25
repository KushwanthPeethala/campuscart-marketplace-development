import { Category } from '../models/Category.js'
import { Product } from '../models/Product.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listCategories = asyncHandler(async (_req, res) => {
  res.json(await Category.find().sort({ _id: 1 }))
})

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug.toLowerCase() })
  if (!category) throw new ApiError(404, 'Category not found')
  res.json(category)
})

/** { books: 3, electronics: 4, ... } — includes zeros so the UI never sees undefined. */
export const categoryCounts = asyncHandler(async (_req, res) => {
  const [categories, rows] = await Promise.all([
    Category.find().select('slug'),
    Product.aggregate([{ $match: { status: { $ne: 'sold' } } }, { $group: { _id: '$category', n: { $sum: 1 } } }]),
  ])
  const counts = Object.fromEntries(categories.map((c) => [c.slug, 0]))
  for (const r of rows) if (r._id in counts) counts[r._id] = r.n
  res.json(counts)
})
