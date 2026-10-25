import { CategoryCard } from '@/components/category/category-card'
import { SectionHeading } from '@/components/section-heading'
import type { Category, CategorySlug } from '@/lib/types'

export function CategoriesSection({
  categories,
  counts,
}: {
  categories: Category[]
  counts: Record<CategorySlug, number>
}) {
  return (
    <section
      id="categories"
      aria-labelledby="categories-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
    >
      <SectionHeading
        id="categories-title"
        eyebrow="Browse by category"
        title="Find what your semester needs"
        action={{ href: '/categories', label: 'All categories' }}
      />
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map((category) => (
          <li key={category.slug}>
            <CategoryCard category={category} count={counts[category.slug]} />
          </li>
        ))}
      </ul>
    </section>
  )
}
