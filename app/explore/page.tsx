import type { Metadata } from 'next'
import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { ExploreFilters } from '@/components/explore/explore-filters'
import { buildExploreHref } from '@/lib/explore-href'
import { PageHeader } from '@/components/page-header'
import { ProductGrid } from '@/components/product/product-grid'
import { getCategories, getProducts, isCategorySlug } from '@/lib/services/products'
import type { ProductSort } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Explore Products',
  description:
    'Search and filter second-hand textbooks, electronics, lab equipment and college essentials from students near you.',
}

const sorts: ProductSort[] = ['newest', 'price-asc', 'price-desc']

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const params = await searchParams
  const q = params.q?.trim() || undefined
  const category = isCategorySlug(params.category) ? params.category : undefined
  const sort = sorts.includes(params.sort as ProductSort)
    ? (params.sort as ProductSort)
    : 'newest'

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ q, category, sort }),
  ])

  const categoryName = categories.find((c) => c.slug === category)?.name
  const hasFilters = Boolean(q || category)

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title={categoryName ?? 'All products'}
        description="Pre-loved essentials listed by students on campuses across India."
      >
        <ExploreFilters categories={categories} q={q} category={category} sort={sort} />
      </PageHeader>

      <section
        aria-labelledby="results-title"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <h2 id="results-title" className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-semibold text-foreground">{products.length}</span>{' '}
            {products.length === 1 ? 'result' : 'results'}
            {q && (
              <>
                {' '}for <span className="font-semibold text-foreground">&ldquo;{q}&rdquo;</span>
              </>
            )}
            {categoryName && (
              <>
                {' '}in <span className="font-semibold text-foreground">{categoryName}</span>
              </>
            )}
          </h2>
          {hasFilters && (
            <Link
              href={buildExploreHref({ sort })}
              className="rounded text-sm font-semibold text-primary hover:text-brand focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Clear filters
            </Link>
          )}
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} priorityCount={4} />
        ) : (
          <EmptyState
            icon={SearchX}
            title="No items match your search"
            description="Try a different keyword or browse another category. New listings are added every day."
            action={{ href: '/explore', label: 'Browse all products' }}
          />
        )}
      </section>
    </>
  )
}
