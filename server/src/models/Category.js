import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
})

categorySchema.set('toJSON', {
  transform: (_doc, ret) => ({ slug: ret.slug, name: ret.name, description: ret.description }),
})

export const Category = mongoose.model('Category', categorySchema)
