import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, ChevronRight, MapPin, MessageCircle, ShieldCheck } from 'lucide-react'
import { ConditionBadge } from '@/components/product/condition-badge'
import { ProductGrid } from '@/components/product/product-grid'
import { WishlistButton } from '@/components/product/wishlist-button'
import { SectionHeading } from '@/components/section-heading'
import { buttonVariants } from '@/components/ui/button'
import { discountPercent, formatINR, formatListedDate } from '@/lib/format'
import { getCategory, getProduct, getSimilarProducts } from '@/lib/services/products'
import { cn } from '@/lib/utils'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Item not found' }
  return { title: product.title, description: product.description }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const [category, similar] = await Promise.all([
    getCategory(product.category),
    getSimilarProducts(product),
  ])
  const discount = discountPercent(product.price, product.originalPrice)
  const initials = product.seller.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </li>
          <li className="flex items-center gap-1.5">
            <Link href={`/explore?category=${product.category}`} className="hover:text-foreground">
              {category?.name}
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </li>
          <li aria-current="page" className="line-clamp-1 font-medium text-foreground">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-mint">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.title}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
          />
          <ConditionBadge condition={product.condition} className="absolute top-4 left-4" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-brand">{category?.name}</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              {product.title}
            </h1>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  <span className="sr-only">Original price </span>
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {discount && (
                <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-primary">
                  Save {discount}%
                </span>
              )}
            </div>
          </div>

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-mint p-4">
              <dt className="text-muted-foreground">Condition</dt>
              <dd className="mt-1 font-semibold text-foreground">{product.condition}</dd>
            </div>
            <div className="rounded-xl bg-mint p-4">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <CalendarDays className="size-3.5" aria-hidden="true" /> Listed
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{formatListedDate(product.listedAt)}</dd>
            </div>
            <div className="col-span-2 rounded-xl bg-mint p-4">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" /> Pickup location
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{product.campus}</dd>
            </div>
          </dl>

          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
              aria-hidden="true"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{product.seller.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {product.seller.course} · {product.seller.college}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className={cn(buttonVariants(), 'h-12 flex-1 rounded-full px-6 text-sm')}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Contact Seller
            </Link>
            <WishlistButton
              productId={product.id}
              productTitle={product.title}
              variant="full"
              className="flex-1"
            />
          </div>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-brand" aria-hidden="true" />
            Meet in a public campus space and inspect the item before paying.
          </p>
        </div>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="mt-20">
          <SectionHeading
            id="similar-title"
            eyebrow="You might also like"
            title="Similar products"
            action={{ href: `/explore?category=${product.category}`, label: 'See more' }}
          />
          <ProductGrid products={similar} className="mt-8" />
        </section>
      )}
    </div>
  )
}
