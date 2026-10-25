import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        We couldn&apos;t find that page
      </h1>
      <p className="text-muted-foreground">
        The listing may have been sold or removed by the seller.
      </p>
      <Link href="/explore" className={cn(buttonVariants(), 'mt-2 h-11 rounded-full px-5')}>
        Explore products
      </Link>
    </section>
  )
}
