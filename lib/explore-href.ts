import type { ProductSort } from '@/lib/types'

export function buildExploreHref(params: {
  q?: string
  category?: string
  sort?: ProductSort
}) {
  const sp = new URLSearchParams()
  if (params.q) sp.set('q', params.q)
  if (params.category) sp.set('category', params.category)
  if (params.sort && params.sort !== 'newest') sp.set('sort', params.sort)
  const qs = sp.toString()
  return qs ? `/explore?${qs}` : '/explore'
}
