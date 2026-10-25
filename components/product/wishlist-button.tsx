'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  productTitle: string
  variant?: 'icon' | 'full'
  className?: string
}

export function WishlistButton({
  productId,
  productTitle,
  variant = 'icon',
  className,
}: WishlistButtonProps) {
  const { has, toggle } = useWishlist()
  const saved = has(productId)

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        aria-pressed={saved}
        className={cn(
          'inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
          saved
            ? 'border-brand bg-mint text-primary'
            : 'border-border bg-card text-foreground hover:bg-mint',
          className,
        )}
      >
        <Heart
          className={cn('size-4', saved && 'fill-brand text-brand')}
          aria-hidden="true"
        />
        {saved ? 'Saved to Wishlist' : 'Add to Wishlist'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productTitle} from wishlist` : `Save ${productTitle} to wishlist`}
      className={cn(
        'flex size-9 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5 backdrop-blur transition-transform hover:scale-105 active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none',
        className,
      )}
    >
      <Heart
        className={cn(
          'size-[18px] transition-colors',
          saved ? 'fill-brand text-brand' : 'text-foreground',
        )}
        aria-hidden="true"
      />
    </button>
  )
}
