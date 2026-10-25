'use client'

import { Heart } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { ProductGrid } from '@/components/product/product-grid'
import { useWishlist } from '@/hooks/use-wishlist'
import type { Product } from '@/lib/types'

export function WishlistView({ products }: { products: Product[] }) {
  const { ids } = useWishlist()
  const saved = products.filter((p) => ids.includes(p.id))

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Tap the heart on any listing to save it here and come back to it later."
        action={{ href: '/explore', label: 'Explore products' }}
      />
    )
  }

  return <ProductGrid products={saved} />
}
