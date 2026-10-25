import mongoose from 'mongoose'

export const CONDITIONS = ['Like New', 'Good', 'Used']
export const LISTING_TYPES = ['sell', 'exchange', 'both']
export const STATUSES = ['available', 'reserved', 'sold']

const productSchema = new mongoose.Schema(
  {
    // Public, URL-friendly id used by the frontend (/products/[id]).
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    condition: { type: String, enum: CONDITIONS, required: true },
    // Category slug (e.g. "books"), validated against the Category collection.
    category: { type: String, required: true, index: true },
    images: { type: [String], default: [] },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    campus: { type: String, required: true, trim: true, maxlength: 120 },
    listingType: { type: String, enum: LISTING_TYPES, default: 'sell' },
    exchangeFor: { type: String, trim: true, maxlength: 300, default: '' },
    status: { type: String, enum: STATUSES, default: 'available', index: true },
    featured: { type: Boolean, default: false },
    listedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
)

productSchema.index({ status: 1, category: 1, listedAt: -1 })

export const Product = mongoose.model('Product', productSchema)
