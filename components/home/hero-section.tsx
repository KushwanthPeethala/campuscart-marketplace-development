import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, GraduationCap, Plus } from 'lucide-react'
import { SearchBar } from '@/components/search-bar'
import { buttonVariants } from '@/components/ui/button'
import { formatINR } from '@/lib/format'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

const popularSearches = ['Grewal', 'Casio calculator', 'Lab coat', 'Drawing kit']

export function HeroSection({ spotlight }: { spotlight?: Product }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-gradient-to-b from-mint to-background"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:pt-20 lg:pb-24">
        <div className="flex flex-col gap-7">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/20 bg-card px-3 py-1.5 text-xs font-semibold text-primary">
            <GraduationCap className="size-4 text-brand" aria-hidden="true" />
            Built for college students across India
          </p>

          <div className="flex flex-col gap-5">
            <h1
              id="hero-title"
              className="text-4xl leading-[1.08] font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl"
            >
              Your Campus <span className="text-brand">Marketplace</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Buy, sell, and exchange books, electronics, and college essentials
              with students around you.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <SearchBar size="lg" className="max-w-xl" />
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Popular:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/explore?q=${encodeURIComponent(term)}`}
                  className="rounded-full bg-card px-3 py-1 text-foreground ring-1 ring-border transition-colors hover:bg-mint hover:ring-brand/30 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/explore"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 rounded-full px-6 text-sm shadow-sm hover:bg-primary/90',
              )}
            >
              Explore Products
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/sell"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-12 rounded-full bg-card px-6 text-sm',
              )}
            >
              <Plus className="size-4" aria-hidden="true" />
              Sell Your Item
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-mint shadow-[0_24px_60px_-28px_rgba(36,91,59,0.45)] lg:aspect-square">
            <Image
              src="/images/hero-collage.png"
              alt="Textbooks, a scientific calculator, a lab coat, headphones and stationery laid out on a table"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>

          {spotlight && (
            <Link
              href={`/products/${spotlight.id}`}
              className="absolute -bottom-6 left-4 flex max-w-[280px] items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-4 shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:left-6"
            >
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-mint">
                <Image
                  src={spotlight.images[0] || '/placeholder.svg'}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[11px] font-semibold tracking-wide text-brand uppercase">
                  Just listed
                </span>
                <span className="truncate text-sm font-semibold text-foreground">
                  {spotlight.title}
                </span>
                <span className="text-sm font-bold text-primary">
                  {formatINR(spotlight.price)}
                </span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
