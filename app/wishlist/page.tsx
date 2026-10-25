import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { WishlistView } from '@/components/wishlist/wishlist-view'
import { getProducts } from '@/lib/services/products'

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Items you have saved on CampusCart.',
}

export default async function WishlistPage() {
  const products = await getProducts()
  return (
    <>
      <PageHeader
        eyebrow="Wishlist"
        title="Saved items"
        description="Keep track of listings you are interested in."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="sr-only">Saved products</h2>
        <WishlistView products={products} />
      </section>
    </>
  )
}
