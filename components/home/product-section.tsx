import { ProductGrid } from '@/components/product/product-grid'
import { SectionHeading } from '@/components/section-heading'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProductSectionProps {
  id: string
  eyebrow: string
  title: string
  description?: string
  products: Product[]
  action?: { href: string; label: string }
  tinted?: boolean
}

export function ProductSection({
  id,
  eyebrow,
  title,
  description,
  products,
  action,
  tinted = false,
}: ProductSectionProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn(tinted && 'bg-mint')}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          id={`${id}-title`}
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={action}
        />
        <ProductGrid products={products} className="mt-8" />
      </div>
    </section>
  )
}
