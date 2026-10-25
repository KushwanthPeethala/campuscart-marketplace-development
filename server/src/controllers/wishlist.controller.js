import mongoose from 'mongoose'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { serializeProduct } from '../utils/serializers.js'

async function resolveProduct(id) {
  const filter = mongoose.isValidObjectId(id) ? { $or: [{ slug: id }, { _id: id }] } : { slug: id }
  const product = await Product.findOne(filter).select('_id slug')
  if (!product) throw new ApiError(404, 'Product not found')
  return product
}

async function wishlistPayload(userId) {
  const user = await User.findById(userId).populate({
    path: 'wishlist',
    populate: { path: 'seller', select: 'name course college' },
  })
  const items = user.wishlist.filter(Boolean)
  return { ids: items.map((p) => p.slug), items: items.map(serializeProduct) }
}

export const getWishlist = asyncHandler(async (req, res) => res.json(await wishlistPayload(req.user._id)))

export const addToWishlist = asyncHandler(async (req, res) => {
  const product = await resolveProduct(req.params.id)
  await User.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: product._id } })
  res.json(await wishlistPayload(req.user._id))
})

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const product = await resolveProduct(req.params.id)
  await User.updateOne({ _id: req.user._id }, { $pull: { wishlist: product._id } })
  res.json(await wishlistPayload(req.user._id))
})
