import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn(
        'inline-flex items-center gap-2 rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        className,
      )}
      aria-label="CampusCart home"
    >
      <span
        className={cn(
          'flex size-9 items-center justify-center rounded-xl',
          inverted ? 'bg-white text-primary' : 'bg-primary text-primary-foreground',
        )}
        aria-hidden="true"
      >
        <ShoppingBag className="size-5" strokeWidth={2.25} />
      </span>
      <span
        className={cn(
          'text-lg font-bold tracking-tight',
          inverted ? 'text-white' : 'text-foreground',
        )}
      >
        Campus<span className={inverted ? 'text-mint/80' : 'text-brand'}>Cart</span>
      </span>
    </Link>
  )
}
