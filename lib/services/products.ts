import { categories } from '@/lib/mock-data/categories'
import { products } from '@/lib/mock-data/products'
import type {
  Category,
  CategorySlug,
  Product,
  ProductQuery,
} from '@/lib/types'

/**
 * Product data access layer.
 *
 * Every UI component reads data through these functions, so swapping the mock
 * dataset for the future Express + MongoDB REST API only requires changing the
 * bodies below (e.g. `fetch(`${process.env.API_BASE_URL}/products?...`)`).
 */

export function isCategorySlug(value: unknown): value is CategorySlug {
  return categories.some((c) => c.slug === value)
}

export async function getCategories(): Promise<Category[]> {
  return categories
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug)
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const { q, category, sort = 'newest', limit } = query
  const term = q?.trim().toLowerCase()

  let result = products.filter((p) => {
    if (category && p.category !== category) return false
    if (!term) return true
    const categoryName =
      categories.find((c) => c.slug === p.category)?.name ?? ''
    return [p.title, p.description, p.campus, p.seller.name, categoryName]
      .join(' ')
      .toLowerCase()
      .includes(term)
  })

  result = [...result].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
  })

  return typeof limit === 'number' ? result.slice(0, limit) : result
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const featuredIds = [
    'grewal-engineering-maths',
    'casio-fx-991ex',
    'cotton-lab-coat-m',
    'wireless-headphones',
    'drawing-instrument-box',
    'hc-verma-physics-set',
    'lab-safety-kit',
    'badminton-racquet-set',
  ]
  return featuredIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
}

export async function getRecentProducts(limit = 4): Promise<Product[]> {
  return getProducts({ sort: 'newest', limit })
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return products.find((p) => p.id === id)
}

export async function getSimilarProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return products.filter((p) => ids.includes(p.id))
}

export async function getCategoryCounts(): Promise<Record<CategorySlug, number>> {
  return categories.reduce(
    (acc, c) => {
      acc[c.slug] = products.filter((p) => p.category === c.slug).length
      return acc
    },
    {} as Record<CategorySlug, number>,
  )
}
