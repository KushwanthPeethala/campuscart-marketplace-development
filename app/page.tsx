import { CategoriesSection } from '@/components/home/categories-section'
import { HeroSection } from '@/components/home/hero-section'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { ProductSection } from '@/components/home/product-section'
import { TrustSection } from '@/components/home/trust-section'
import {
  getCategories,
  getCategoryCounts,
  getFeaturedProducts,
  getRecentProducts,
} from '@/lib/services/products'

export default async function HomePage() {
  const [categories, counts, featured, recent] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getFeaturedProducts(),
    getRecentProducts(4),
  ])

  return (
    <>
      <HeroSection spotlight={recent[0]} />
      <CategoriesSection categories={categories} counts={counts} />
      <ProductSection
        id="featured"
        eyebrow="Featured listings"
        title="Popular picks this week"
        description="Hand-picked deals on the things students search for most."
        products={featured}
        action={{ href: '/explore', label: 'View all products' }}
        tinted
      />
      <ProductSection
        id="recent"
        eyebrow="Recently added"
        title="Fresh on campus"
        products={recent}
        action={{ href: '/explore?sort=newest', label: 'See latest' }}
      />
      <HowItWorksSection />
      <TrustSection />
    </>
  )
}
