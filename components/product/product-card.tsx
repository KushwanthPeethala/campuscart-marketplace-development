import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { ConditionBadge } from '@/components/product/condition-badge'
import { WishlistButton } from '@/components/product/wishlist-button'
import { categories } from '@/lib/mock-data/categories'
import { discountPercent, formatINR } from '@/lib/format'
import type { Product } from '@/lib/types'

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product
  priority?: boolean
}) {
  const categoryName =
    categories.find((c) => c.slug === product.category)?.name ?? ''
  const discount = discountPercent(product.price, product.originalPrice)
  const href = `/products/${product.id}`

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 focus-within:ring-3 focus-within:ring-ring/40 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(32,40,32,0.25)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-mint">
        <Image
          src={product.images[0] || '/placeholder.svg'}
          alt={product.title}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <ConditionBadge
          condition={product.condition}
          className="absolute top-3 left-3"
        />
        <WishlistButton
          productId={product.id}
          productTitle={product.title}
          className="absolute top-3 right-3 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs font-medium text-brand">{categoryName}</p>
        <h3 className="line-clamp-2 font-semibold leading-snug text-foreground text-pretty">
          <Link
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.title}
          </Link>
        </h3>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-lg font-bold text-foreground">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              <span className="sr-only">Original price </span>
              {formatINR(product.originalPrice)}
            </span>
          )}
          {discount && (
            <span className="text-xs font-semibold text-brand">{discount}% off</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <div className="min-w-0 text-xs">
            <p className="truncate font-medium text-foreground">{product.seller.name}</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-muted-foreground">
              <MapPin className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{product.campus}</span>
            </p>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary"
            aria-hidden="true"
          >
            View Item
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
