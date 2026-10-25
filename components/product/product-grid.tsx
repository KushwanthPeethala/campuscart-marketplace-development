import { ProductCard } from '@/components/product/product-card'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ProductGrid({
  products,
  className,
  priorityCount = 0,
}: {
  products: Product[]
  className?: string
  priorityCount?: number
}) {
  return (
    <ul
      className={cn(
        'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  )
}
