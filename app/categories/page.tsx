import type { Metadata } from 'next'
import { CategoryCard } from '@/components/category/category-card'
import { PageHeader } from '@/components/page-header'
import { getCategories, getCategoryCounts } from '@/lib/services/products'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse student listings by category on CampusCart.',
}

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([getCategories(), getCategoryCounts()])

  return (
    <>
      <PageHeader
        eyebrow="Categories"
        title="Browse by category"
        description="From first-year textbooks to hostel essentials, pick a category to see what students are selling."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="sr-only">All categories</h2>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <CategoryCard category={c} count={counts[c.slug]} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
