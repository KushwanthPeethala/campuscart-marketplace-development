'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { ChevronDown } from 'lucide-react'
import { SearchBar } from '@/components/search-bar'
import { buildExploreHref } from '@/lib/explore-href'
import type { Category, CategorySlug, ProductSort } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ExploreFiltersProps {
  categories: Category[]
  q?: string
  category?: CategorySlug
  sort: ProductSort
}

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

export function ExploreFilters({ categories, q, category, sort }: ExploreFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  function navigate(next: { q?: string; category?: string; sort?: ProductSort }) {
    startTransition(() => {
      router.push(buildExploreHref({ q, category, sort, ...next }), { scroll: false })
    })
  }

  const chips: { slug?: CategorySlug; label: string }[] = [
    { label: 'All' },
    ...categories.map((c) => ({ slug: c.slug, label: c.name })),
  ]

  return (
    <div className="flex flex-col gap-5">
      <SearchBar
        key={`${pathname}-${q ?? ''}`}
        defaultValue={q}
        onSearch={(term) => navigate({ q: term || undefined })}
        className="max-w-2xl"
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Filter by category" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex w-max gap-2 pb-1 md:w-auto md:flex-wrap">
            {chips.map((chip) => {
              const active = chip.slug === category
              return (
                <li key={chip.label}>
                  <Link
                    href={buildExploreHref({ q, category: chip.slug, sort })}
                    scroll={false}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'inline-flex h-9 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground ring-1 ring-border hover:bg-mint',
                    )}
                  >
                    {chip.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="relative w-full shrink-0 sm:w-56">
          <label htmlFor="sort" className="sr-only">
            Sort products
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => navigate({ sort: e.target.value as ProductSort })}
            className="h-10 w-full appearance-none rounded-full border border-border bg-card pr-10 pl-4 text-sm font-medium text-foreground focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
