import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-mint text-primary">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <p className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-primary">
        Coming soon
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">{title}</h1>
      <p className="text-muted-foreground text-pretty">{description}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/explore" className={cn(buttonVariants(), 'h-11 rounded-full px-5')}>
          Explore products
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'outline' }), 'h-11 rounded-full px-5')}
        >
          Back to home
        </Link>
      </div>
    </section>
  )
}
