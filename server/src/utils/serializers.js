/**
 * Convert a populated Product document into the shape of `Product` in the
 * frontend's lib/types.ts (plus the new listingType/status/exchangeFor fields).
 */
export function serializeProduct(p) {
  const seller = p.seller && p.seller.toSeller ? p.seller.toSeller() : null
  return {
    id: p.slug,
    title: p.title,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    condition: p.condition,
    category: p.category,
    images: p.images,
    seller,
    campus: p.campus,
    listedAt: p.listedAt.toISOString(),
    listingType: p.listingType,
    exchangeFor: p.exchangeFor || undefined,
    status: p.status,
  }
}
