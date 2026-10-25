import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CategoryIcon } from '@/components/category/category-icon'
import type { Category } from '@/lib/types'

export function CategoryCard({
  category,
  count,
}: {
  category: Category
  count?: number
}) {
  return (
    <Link
      href={`/explore?category=${category.slug}`}
      className="group flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_8px_24px_-12px_rgba(36,91,59,0.25)] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-xl bg-mint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <CategoryIcon slug={category.slug} className="size-6" />
        </span>
        <ArrowUpRight
          className="size-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-foreground text-pretty">{category.name}</h3>
        <p className="text-sm text-muted-foreground">{category.description}</p>
        {typeof count === 'number' && (
          <p className="mt-2 text-xs font-medium text-brand">
            {count} {count === 1 ? 'listing' : 'listings'}
          </p>
        )}
      </div>
    </Link>
  )
}
