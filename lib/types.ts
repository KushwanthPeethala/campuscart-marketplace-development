export type ProductCondition = 'Like New' | 'Good' | 'Used'

export type CategorySlug =
  | 'books'
  | 'electronics'
  | 'essentials'
  | 'lab'
  | 'stationery'
  | 'sports'

export interface Category {
  slug: CategorySlug
  name: string
  description: string
}

export interface Seller {
  id: string
  name: string
  course: string
  college: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  condition: ProductCondition
  category: CategorySlug
  images: string[]
  seller: Seller
  campus: string
  listedAt: string
}

export type ProductSort = 'newest' | 'price-asc' | 'price-desc'

export interface ProductQuery {
  q?: string
  category?: CategorySlug
  sort?: ProductSort
  limit?: number
}
